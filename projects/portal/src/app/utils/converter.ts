export const convertHexStringToUint8Array = (hexString: string): Uint8Array | undefined => {
  try {
    const hexStringWithNoWhitespace = hexString.replace(/\s+/g, '');
    const buffer = Buffer.from(hexStringWithNoWhitespace, 'hex');
    const uint8Array = Uint8Array.from(buffer);
    return uint8Array;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const convertUint8ArrayToHexString = (uint8Array: Uint8Array): string | undefined => {
  try {
    const hexString: string = Buffer.from(uint8Array).toString('hex');
    return hexString;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
