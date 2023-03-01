import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { AuctionApplicationService } from 'projects/portal/src/app/models/auctions/auction.application.service';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { UnunifiRestService } from 'projects/portal/src/app/models/ununifi-rest.service';
import { PlaceBidOnSubmitEvent } from 'projects/portal/src/app/views/auction/auctions/auction/place-bid/place-bid.component';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import ununifi from 'ununifi-client';

@Component({
  selector: 'app-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css'],
})
export class PlaceBidComponent implements OnInit {
  key$: Observable<Key | undefined>;
  auctionID$: Observable<string>;
  auction$: Observable<ununifi.proto.ununifi.auction.CollateralAuction | undefined>;
  endTime$: Observable<Date | undefined>;
  maxEndTime$: Observable<Date | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly keyStore: KeyStoreService,
    private readonly auctionApplicationService: AuctionApplicationService,
    private readonly configS: ConfigService,
    private ununifiRest: UnunifiRestService,
  ) {
    this.key$ = this.keyStore.currentKey$.asObservable();
    this.auctionID$ = this.route.params.pipe(map((params) => params.auction_id));
    this.auction$ = this.auctionID$.pipe(
      mergeMap((id) => this.ununifiRest.getAuction$(id)),
      map((auction) => {
        const anyAuction = auction as {
          base_auction: { end_time: string; max_end_time: string };
        };
        const parseAuction = (anyAuction: any): { type_url?: string; value?: string } => {
          anyAuction.base_auction.end_time = ununifi.proto.google.protobuf.Timestamp.fromObject({
            seconds: Date.parse(anyAuction.base_auction.end_time),
            nanos: 0,
          });
          anyAuction.base_auction.max_end_time = ununifi.proto.google.protobuf.Timestamp.fromObject(
            {
              seconds: Date.parse(anyAuction.base_auction.max_end_time),
              nanos: 0,
            },
          );
          return anyAuction;
        };
        const unpackAuction = cosmosclient.codec.protoJSONToInstance(
          cosmosclient.codec.castProtoJSONOfProtoAny(parseAuction(anyAuction)),
        );
        if (!(unpackAuction instanceof ununifi.proto.ununifi.auction.CollateralAuction)) {
          return;
        }
        return unpackAuction;
      }),
    );
    this.endTime$ = this.auction$.pipe(
      map((auction) => {
        if (!Number(auction?.base_auction?.end_time?.seconds)) {
          console.log(auction?.base_auction?.end_time?.seconds);
          return;
        }
        const endTime = new Date();
        endTime.setTime(Number(auction?.base_auction?.end_time?.seconds));
        return endTime;
      }),
    );
    this.maxEndTime$ = this.auction$.pipe(
      map((auction) => {
        if (!Number(auction?.base_auction?.end_time?.seconds)) {
          console.log(auction?.base_auction?.max_end_time?.seconds);
          return;
        }
        const maxEndTime = new Date();
        maxEndTime.setTime(Number(auction?.base_auction?.max_end_time?.seconds));
        return maxEndTime;
      }),
    );
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  onSubmit($event: PlaceBidOnSubmitEvent) {
    this.auctionApplicationService.placeBid(
      Number($event.auctionID),
      $event.amount,
      $event.minimumGasPrice,
      1.1,
    );
  }
}
