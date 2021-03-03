import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './login/authentication/auth-guard.service';
import { PrintSettingsComponent } from './print/print-settings/print-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  // UserPincodePage
  {
    path: 'userpincode',
    loadChildren: () => import('./user-pincode/user-pincode.module').then(m => m.UserPincodePageModule), 
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    
  },
  {
    path: 'posdevice',
    loadChildren: () => import('./pos-thermal-device/pos-thermal-device.module').then(m => m.PosThermalDevicePageModule)
  }, 
  {
    path: 'pointofsales',
    loadChildren: () => import('./pointofsales/pointofsales.module').then(m => m.PointofsalesPageModule)
  }, {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingPageModule)
  },
  {
    path: 'pos-table',
    loadChildren: () => import('./pos-table/pos-table.module').then(m => m.PosTablePageModule)
  },
  {
    path: 'print-settings',
    component: PrintSettingsComponent
  },
  
  // { path: 'pointofsales', loadChildren: './pointofsales/pointofsales.module#PointofsalesPageModule' },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
