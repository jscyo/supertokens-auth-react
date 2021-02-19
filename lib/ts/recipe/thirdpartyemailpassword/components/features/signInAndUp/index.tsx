/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
/*
 * Imports.
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { PureComponent, Fragment } from "react";
import { FeatureBaseProps } from "../../../../../types";
import { NormalisedThirdPartyEmailPasswordConfig } from "../../../types";
import SuperTokens from "../../../../../superTokens";
import AuthRecipeModule from "../../../../authRecipeModule";
import {
    SignInAndUpTheme,
    ThirdPartyEmailPasswordGetRedirectionURLContext,
    ThirdPartyEmailPasswordOnHandleEventContext,
    ThirdPartyEmailPasswordPreAPIHookContext
} from "../../..";
import { NormalisedAuthRecipeConfig } from "../../../../authRecipeModule/types";
import FeatureWrapper from "../../../../../components/featureWrapper";
import { default as ThirdPartySignInAndUp } from "../../../../thirdparty/components/features/signInAndUp";
import { default as EmailPasswordSignInAndUp } from "../../../../emailpassword/components/features/signInAndUp";
import { StyleProvider } from "../../../../../styles/styleContext";
import { defaultPalette } from "../../../../../styles/styles";
import { getStyles } from "../../themes/styles";
import { SignInAndUpProvidersTheme } from "../../../../thirdparty/components/themes/signInAndUp";
import { SignInAndUpThemeProps as ThirdPartySignInAndUpThemeProps } from "../../../../thirdparty/types";
import EmailPasswordSignInAndUpForm from "../../themes/signInAndUp/signInAndUpForm";
import { SignInAndUpThemeProps as EmailPasswordSignInAndUpThemeProps } from "../../../../emailpassword/types";

/*
 * Component.
 */

class SignInAndUp extends PureComponent<FeatureBaseProps, { status: "SIGN_IN" | "SIGN_UP" }> {
    /*
     * Constructor.
     */
    constructor(props: FeatureBaseProps) {
        super(props);

        const status: "SIGN_IN" | "SIGN_UP" = this.getRecipeConfigOrThrow().signInAndUpFeature.defaultToSignUp
            ? "SIGN_UP"
            : "SIGN_IN";
        this.state = {
            status
        };
    }

    getRecipeInstanceOrThrow = (): AuthRecipeModule<
        ThirdPartyEmailPasswordGetRedirectionURLContext,
        ThirdPartyEmailPasswordPreAPIHookContext,
        ThirdPartyEmailPasswordOnHandleEventContext
    > => {
        if (this.props.recipeId === undefined) {
            throw new Error("No recipeId props given to SignInAndUp component");
        }

        const recipe = SuperTokens.getInstanceOrThrow().getRecipeOrThrow(this.props.recipeId);
        if (recipe instanceof AuthRecipeModule === false) {
            throw new Error(`${recipe.recipeId} must be an instance of AuthRecipeModule to use SignInAndUp component.`);
        }

        return recipe as AuthRecipeModule<
            ThirdPartyEmailPasswordGetRedirectionURLContext,
            ThirdPartyEmailPasswordPreAPIHookContext,
            ThirdPartyEmailPasswordOnHandleEventContext
        >;
    };

    getRecipeConfigOrThrow = (): NormalisedThirdPartyEmailPasswordConfig & NormalisedAuthRecipeConfig => {
        return this.getRecipeInstanceOrThrow().getConfig<
            NormalisedThirdPartyEmailPasswordConfig & NormalisedAuthRecipeConfig
        >();
    };

    getIsEmbedded = (): boolean => {
        if (this.props.isEmbedded !== undefined) {
            return this.props.isEmbedded;
        }
        return false;
    };

    toggleStatus = (status: "SIGN_IN" | "SIGN_UP"): void => {
        this.setState({
            status
        });
    };

    render = (): JSX.Element => {
        /*
         * Render.
         */
        return (
            <FeatureWrapper useShadowDom={this.getRecipeConfigOrThrow().useShadowDom}>
                <StyleProvider
                    rawPalette={this.getRecipeConfigOrThrow().palette}
                    defaultPalette={defaultPalette}
                    styleFromInit={this.getRecipeConfigOrThrow().signInAndUpFeature.style}
                    getDefaultStyles={getStyles}>
                    <Fragment>
                        {/* No custom theme, use default. */}
                        {this.props.children === undefined && (
                            <SignInAndUpTheme
                                status={this.state.status}
                                toggleStatus={this.toggleStatus}
                                thirdParty={
                                    <ThirdPartySignInAndUp
                                        history={this.props.history}
                                        recipeId={this.getRecipeInstanceOrThrow().recipeId}
                                        isEmbedded={true}>
                                        <SignInAndUpProvidersTheme
                                            // Seed props. Real props will be given by parent feature.
                                            {...({} as ThirdPartySignInAndUpThemeProps)}
                                        />
                                    </ThirdPartySignInAndUp>
                                }
                                emailPassword={
                                    <EmailPasswordSignInAndUp
                                        history={this.props.history}
                                        recipeId={this.getRecipeInstanceOrThrow().recipeId}
                                        isEmbedded={true}>
                                        <EmailPasswordSignInAndUpForm
                                            // Seed props. Real props will be given by parent feature.
                                            {...({} as EmailPasswordSignInAndUpThemeProps)}
                                            status={this.state.status}
                                        />
                                    </EmailPasswordSignInAndUp>
                                }
                            />
                        )}
                        {/* Otherwise, custom theme is provided, propagate props. */}
                        {this.props.children &&
                            React.cloneElement(this.props.children, {
                                rawPalette: this.getRecipeConfigOrThrow().palette,
                                defaultToSignUp: this.getRecipeConfigOrThrow().signInAndUpFeature.defaultToSignUp,
                                providers: this.getRecipeConfigOrThrow().signInAndUpFeature.providers,
                                signInForm: this.getRecipeConfigOrThrow().signInAndUpFeature.signInForm,
                                signUpForm: this.getRecipeConfigOrThrow().signInAndUpFeature.signUpForm
                            })}
                    </Fragment>
                </StyleProvider>
            </FeatureWrapper>
        );
    };
}

export default SignInAndUp;
