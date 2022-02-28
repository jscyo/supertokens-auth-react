import { NormalisedAppInfo, Styles } from "../../types";
export declare type RecipePreAPIHookContext<Action> = {
    requestInit: RequestInit;
    url: string;
    action: Action;
    userContext: any;
};
export declare type RecipePostAPIHookContext<Action> = {
    action: Action;
    requestInit: RequestInit;
    url: string;
    fetchResponse: Response;
    userContext: any;
};
export declare type UserInput<GetRedirectionURLContextType, Action, OnHandleEventContextType> = {
    getRedirectionURL?: (context: GetRedirectionURLContextType) => Promise<string | undefined>;
    preAPIHook?: (context: RecipePreAPIHookContext<Action>) => Promise<{
        url: string;
        requestInit: RequestInit;
    }>;
    postAPIHook?: (context: RecipePostAPIHookContext<Action>) => Promise<void>;
    onHandleEvent?: (context: OnHandleEventContextType) => void;
    useShadowDom?: boolean;
    palette?: Record<string, string>;
    style?: Styles;
};
export declare type Config<GetRedirectionURLContextType, Action, OnHandleEventContextType> = {
    recipeId: string;
    appInfo: NormalisedAppInfo;
} & UserInput<GetRedirectionURLContextType, Action, OnHandleEventContextType>;
import { RecipeConfig as WebJSRecipeConfig } from "supertokens-web-js/lib/build/recipe/recipeModule/types";
export declare type NormalisedConfig<GetRedirectionURLContextType, Action, OnHandleEventContextType> =
    WebJSRecipeConfig<Action> & {
        appInfo: NormalisedAppInfo;
        getRedirectionURL: (context: GetRedirectionURLContextType) => Promise<string | undefined>;
        onHandleEvent: (context: OnHandleEventContextType) => void;
        useShadowDom: boolean;
        palette: Record<string, string>;
        rootStyle: Styles;
    };
