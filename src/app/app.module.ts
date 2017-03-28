import {ApplicationRef, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {createInputTransfer, createNewHosts, removeNgStyles} from "@angularclass/hmr";
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {routing} from "./app.routing";
// App is our top level component
import {AppComponent} from "./app.component";
import {APP_RESOLVER_PROVIDERS} from "./app.resolver";
import {AppState, InternalStateType} from "./app.service";
// Core providers
import {CoreModule} from "./core/core.module";
import {SmartadminLayoutModule} from "./shared/layout/layout.module";
import {LoginComponent} from "./+auth/+login/login.component";
import {AuthGuard} from "./+auth/+guards/auth.guards";
import {AuthenticationService} from "./+auth/+services/authentication.service";
import {UserService} from "./+auth/+services/user.service";
import {StorageService} from "./+common/storageLocalValues/storage.service";
import {EmpleadoService} from "./+common/service/empleado.service";
import {PushNotificationsModule} from "angular2-notifications/lib/push-notifications.module";
import {SimpleNotificationsModule} from "angular2-notifications/lib/simple-notifications.module";
import {ForgotPasswordComponent} from "./+forgot/+password/password.component";
import {MensajeRecPasswordComponent} from "./+forgot/+password/mensaje.component";
import {ValidateLinkComponent} from "./+forgot/+password/validatelink.component";
import {InvalidLinkComponent} from "./+forgot/+password/invalidlink.component";
import {ResetPasswordComponent} from "./+forgot/+password/resetpassword.component";
import {ResetPasswordMessageComponent} from "./+forgot/+password/mensajeresetpassword.component";
import {AUTH_PROVIDERS} from "angular2-jwt";
import {provideBackendService} from "./+rest/backend.serviceProvider";
import {NoAutorizadoComponent} from "./+auth/+noautorizado/noautorizado.component";

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        NoAutorizadoComponent,
        ForgotPasswordComponent,
        MensajeRecPasswordComponent,
        ValidateLinkComponent,
        InvalidLinkComponent,
        ResetPasswordComponent,
        ResetPasswordMessageComponent,


    ],
    imports: [ // import Angular's modules
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        CoreModule,
        SmartadminLayoutModule,
        PushNotificationsModule,
        SimpleNotificationsModule,
        routing
    ],
    exports: [],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        AuthGuard,
        AuthenticationService,
        UserService,
        EmpleadoService,
        StorageService,
        PushNotificationsModule,
        SimpleNotificationsModule,
        ENV_PROVIDERS,
        APP_PROVIDERS,
        AUTH_PROVIDERS,
        provideBackendService(),
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef, public appState: AppState) {
    }

    hmrOnInit(store: StoreType) {
        if (!store || !store.state) return;
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}

