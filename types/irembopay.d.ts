declare module '@irembo/irembopay-node-sdk' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IremboPay: any;
  export default IremboPay;
}

interface Window {
  IremboPay?: {
    initiate: (options: {
      publicKey: string;
      invoiceNumber: string;
      locale?: string;
      callback?: (error: unknown, response: unknown) => void;
    }) => void;
    closeModal: () => void;
    locale: {
      EN: string;
      FR: string;
      RW: string;
    };
  };
}
