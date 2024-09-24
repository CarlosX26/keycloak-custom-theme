import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../login/KcContext";
import type { I18n } from "../../login/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

import LogoGalileu from "@/assets/galileu_logo.png";
import Truck from "@/assets/truck.png";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
    const { kcContext, i18n } = props;
    const { realm, url, usernameHidden, login, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <div className="h-screen overflow-hidden flex justify-center items-center bg-gradient-to-r from-blue-500 to-white">
            <div className="min-h-screen w-full mt-12">
                <div className="animate-slideUp w-full px-4">
                    <div className="relative">
                        <div className="flex justify-center items-center absolute bottom-0 left-0 right-0">
                            <div className="flex flex-col">
                                <div className="w-full flex justify-center absolute bottom-0 left-0 right-0">
                                    <img src={Truck} className="w-96 h-96" />
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-1 h-32 bg-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center">
                        <Card className="w-full max-w-xl backdrop-grayscale-0 bg-white/40">
                            <CardHeader>
                                <div className="flex flex-col items-center gap-4">
                                    <CardTitle className="uppercase">
                                        {msg("loginAccountTitle")}
                                    </CardTitle>
                                    <Avatar className="w-20 h-20 border-gray-800 border-2">
                                        <AvatarImage src={LogoGalileu} />
                                    </Avatar>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={() => {
                                        setIsLoginButtonDisabled(true);
                                        return true;
                                    }}
                                    action={url.loginAction}
                                    method="post"
                                >
                                    <Label htmlFor="username">
                                        {" "}
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
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
                                            className="text-red-700"
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
                                    <Label htmlFor="email">{msg("password")}</Label>
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
                                    {usernameHidden &&
                                        messagesPerField.existsError(
                                            "username",
                                            "password"
                                        ) && (
                                            <span
                                                className="text-red-700"
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
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                className="accent-blue-500"
                                                id="rememberMe"
                                                name="rememberMe"
                                                defaultChecked={!!login.rememberMe}
                                            ></Checkbox>
                                            <Label htmlFor="rememberMe">
                                                {" "}
                                                {msg("rememberMe")}
                                            </Label>
                                        </div>
                                    )}
                                    <Button
                                        className="bg-blue-500"
                                        type="submit"
                                        disabled={isLoginButtonDisabled}
                                    >
                                        {msgStr("doLogIn")}
                                    </Button>
                                    {realm.resetPasswordAllowed && (
                                        <span className="text-right">
                                            <a href={url.loginResetCredentialsUrl}>
                                                <p>{msg("doForgotPassword")}</p>
                                            </a>
                                        </span>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
