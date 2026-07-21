export {};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: GoogleInitializeOptions) => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonOptions,
          ) => void;
          cancel: () => void;
        };
      };
    };
  }

  interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
  }

  interface GoogleInitializeOptions {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }

  interface GoogleButtonOptions {
    type?: "standard" | "icon";
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    logo_alignment?: "left" | "center";
    width?: number;
  }
}