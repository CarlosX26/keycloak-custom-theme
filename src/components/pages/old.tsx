import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../login/KcContext";
import type { I18n } from "../../login/i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        registrationDisabled,
        messagesPerField
    } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={
                realm.password && realm.registrationAllowed && !registrationDisabled
            }
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password &&
                        social?.providers !== undefined &&
                        social.providers.length !== 0 && (
                            <div id="kc-social-providers">
                                <hr />
                                <h2>{msg("identity-provider-login-label")}</h2>
                                <ul className="social-provider-list">
                                    {social.providers.map(provider => (
                                        <li key={provider.alias}>
                                            <a
                                                id={`social-${provider.alias}`}
                                                className="social-provider-button"
                                                href={provider.loginUrl}
                                            >
                                                {provider.iconClasses && (
                                                    <i
                                                        className={provider.iconClasses}
                                                        aria-hidden="true"
                                                    ></i>
                                                )}
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(
                                                            provider.displayName
                                                        )
                                                    }}
                                                ></span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {/* Username Input */}
                            {!usernameHidden && (
                                <div className="form-group">
                                    <label htmlFor="username">
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </label>
                                    <Input
                                        id="username"
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        autoFocus
                                        autoComplete="username"
                                        aria-invalid={messagesPerField.existsError(
                                            "username",
                                            "password"
                                        )}
                                    />
                                    {messagesPerField.existsError(
                                        "username",
                                        "password"
                                    ) && (
                                        <span
                                            id="input-error"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(
                                                    messagesPerField.getFirstError(
                                                        "username",
                                                        "password"
                                                    )
                                                )
                                            }}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="password">{msg("password")}</label>
                                <PasswordWrapper i18n={i18n} passwordInputId="password">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={messagesPerField.existsError(
                                            "username",
                                            "password"
                                        )}
                                    />
                                </PasswordWrapper>
                                {usernameHidden &&
                                    messagesPerField.existsError(
                                        "username",
                                        "password"
                                    ) && (
                                        <span
                                            id="input-error"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(
                                                    messagesPerField.getFirstError(
                                                        "username",
                                                        "password"
                                                    )
                                                )
                                            }}
                                        />
                                    )}
                            </div>

                            {/* Remember Me and Forgot Password */}
                            <div className="form-group">
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div>
                                            <Checkbox
                                                id="rememberMe"
                                                name="rememberMe"
                                                defaultChecked={!!login.rememberMe}
                                            >
                                                {msg("rememberMe")}
                                            </Checkbox>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Login Button */}
                            <div id="kc-form-buttons" className="form-group">
                                <input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    value={auth.selectedCredential}
                                />
                                <Button type="submit" disabled={isLoginButtonDisabled}>
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}

// Componente PasswordWrapper para gerenciar visibilidade de senha
function PasswordWrapper(props: {
    i18n: I18n;
    passwordInputId: string;
    children: JSX.Element;
}) {
    const { i18n, passwordInputId, children } = props;
    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer(
        (state: boolean) => !state,
        false
    );

    useEffect(() => {
        const passwordInputElement = document.getElementById(
            passwordInputId
        ) as HTMLInputElement;
        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className="input-group">
            {children}
            <button
                type="button"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? "Hide" : "Show"}
            </button>
        </div>
    );
}
