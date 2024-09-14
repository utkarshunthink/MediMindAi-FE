export interface ButtonAction {
    buttonType: string;
    buttonName: string;
    isNavigate: boolean;
    isModal: boolean;
    navigateUrl: string;
    roleDeny: string[];
}