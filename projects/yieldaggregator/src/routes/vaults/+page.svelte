<script lang="ts">
  import { formula } from 'svelte-formula';
	import { authService } from '../../../models/state';
	import { GoogleAuthProvider } from 'firebase/auth';

	let processing = false;
  let address = "";
	let vault = {
    id: number,
    name:string
  }

  let keyword = ""

	const validators = {};
	const formValidators = {};

	const { form, touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	async function signInGoogle() {
		await authService.signIn(new GoogleAuthProvider());
		location.href = '/';
	}

  function getSymbol(vaultId: number) {
    return ''
  }

  function getSymbolImage(symbol:string ){
    return ''
  }

  function getMinApy(vaultId: number) {
    return 0
  }

  function getMaxApy(vaultId: number) {
    return 0
  }

  function totalDepositedUsdValue(vaultId: number) {
    return 0
  }
</script>

<div class="mx-auto max-w-screen-xl">
  <div class="flex flex-row flex-wrap mb-8">
    <div class="text-xl breadcrumbs">
      <ul>
        <li>Vaults</li>
      </ul>
    </div>
    <span class="flex-auto"></span>
    <div class="flex flex-row gap-2">
      <a class="btn btn-accent btn-outline" href="deposit/{ address }">
        <span class="material-symbols-outlined">monetization_on</span>
        <span>Your Deposits</span>
      </a>
      <a class="btn btn-info btn-outline" href="..">
        <span class="material-symbols-outlined">info</span>
        <span>About</span>
      </a>
    </div>
  </div>

  <div class="flex flex-row flex-wrap items-end mb-8">
    <form use:form on:submit={() => {}}>
      <div class="form-control w-full md:max-w-xs">
        <label class="label">
          <span class="label-text">Filters</span>
        </label>
        <div class="input-group">
          <input
            type="text"
            class="input input-bordered w-full"
            placeholder="ATOM"
            required
            readonly={processing}
            bind:value={keyword}
            name="keyword"
          />
          <button class="btn btn-square" disabled={!$isFormValid || processing}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  </div>

  <div class="card bg-base-100 shadow-xl mb-8">
    <div class="card-body">
      <h2 class="card-title">Available Vaults</h2>
      <p>Select a vault to deposit funds based on your preferences, and earn yield.</p>
      <div class="overflow-x-auto max-h-96">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <td>Name</td>
              <td>description</td>
              <td>Asset</td>
              <td>APY</td>
              <td>Commission Rate</td>
              <td>Total Deposited (USD)</td>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let vault of vaults; let i = index">
              <tr class="hover cursor-pointer" routerLink="{ vault.id }">
                <th>#{ vault.id }</th>
                <div class="dropdown dropdown-hover items-center">
                  <label tabindex="0">
                    <td style="max-width: 10rem" class="truncate">
                      { vault.name }
                    </td>
                  </label>
                  <div
                    tabindex="0"
                    class="dropdown-content z-[1] card card-compact w-96 max-h-48 p-2 shadow bg-base-200 text-primary-content"
                  >
                    <div class="card-body">
                      <h3 class="card-title truncate max-w-full">
                        #{ vault.id } { vault.name }
                      </h3>
                      <p class="truncate">{ vault.description || 'No description' }</p>
                    </div>
                  </div>
                </div>
                <td class="max-w-xs truncate">
                  { vault.description }
                </td>
                <td>
                  <div class="flex items-center space-x-3 gap-2" *ngIf="symbols">
                    <ng-container *ngIf="symbols[i]?.img">
                      <div class="avatar">
                        <div class="mask mask-circle w-6 h-6">
                          <img src="{ getSymbolImage(getSymbol(vault.id))}" alt="Asset Symbol" />
                        </div>
                      </div>
                    </ng-container>
                    <ng-container *ngIf="!symbols[i]?.img">
                      <span class="material-symbols-outlined">question_mark</span>
                    </ng-container>
                    <span>
                      {getSymbol(vault.id)}
                    </span>
                  </div>
                </td>
                <td>
                  <span *ngIf="vaultsInfo?.[i]?.certainty">=</span>
                  <span *ngIf="vaultsInfo?.[i]?.certainty === false">≒</span>
                  <span>{{ getMinApy(vault.id).fixed(2) }}</span>
                  <span *ngIf="vaultsInfo?.[i]?.minApy !== vaultsInfo?.[i]?.maxApy">
                    ~{getMaxApy(vault.id).fixed(2)}
                  </span>
                </td>
                <td>{ vault.withdraw_commission_rate.fixed(2) }</td>
                <td>{ totalDepositedUsdValue(vault.id).fixed(2) }</td>
              </tr>
            </ng-container>
          </tbody>
        </table>
        <p *ngIf="!vaults?.length" class="text-center">There is no vault.</p>
      </div>
    </div>
  </div>

  <div class="card lg:card-side bg-base-100 shadow-xl mb-4">
    <div class="card-body">
      <h2 class="card-title">Vault Creation</h2>
      <P>
        You can become a Vault Creator if you choose to create your own unique vault. Earn
        commission based on strategy popularity.
      </P>
      <ol class="list-decimal ml-4">
        <li>Tailor assets according to your preferences</li>
        <li>Fine-tune your strategy weights</li>
        <li>Set your commission rate</li>
      </ol>
      <div class="card-actions justify-end">
        <button class="btn btn-secondary" routerLink="create">
          <span class="material-symbols-outlined">create</span>
          <span>Create Vault</span>
        </button>
      </div>
    </div>
  </div>
</div>
