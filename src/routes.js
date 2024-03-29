/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import BarangKeluar from "layouts/barang-keluar";
import SignIn from "layouts/authentication/sign-in";
import BarangMasuk from "layouts/barang-masuk";
import ApprovalBarangKeluar from "layouts/barang-keluar/approval-barang-keluar";
import GenerateSuratJalan from "layouts/surat-jalan/generate-surat-jalan";
import ApprovalSuratJalan from "layouts/surat-jalan/approval-surat-jalan";
import ApprovalBarangMasuk from "layouts/barang-masuk/approval-barang-masuk";
import GenerateMutasi from "layouts/mutasi-barang/GenerateMutasi";
import ApprovalMutasi from "layouts/mutasi-barang/ApprovalMutasi";
import ListBarangMasuk from "layouts/barang-masuk/list-barang-masuk";
import ListBarangKeluar from "layouts/barang-keluar/ListBarangKeluar";
import ListSuratJalan from "layouts/surat-jalan/list-surat-jalan";
import ListMutasiBarang from "layouts/mutasi-barang/ListMutasiBarang";
import KartuStok from "layouts/report/kartu-stok";
import PergerakanBarang from "layouts/report/mutasi-barang";
import MasterBarang from "layouts/master/master-barang";
import MasterGudang from "layouts/master/master-gudang";
import MasterPengguna from "layouts/master/master-pengguna";
import MasterCustomer from "layouts/master/master-customer";
import GeneratePackaging from "layouts/packaging";
import ApprovalPemusnahanBarang from "layouts/pemusnahan-barang/approval-pemusnahan-barang";
import MasterPositioning from "layouts/master/master-positioning";
import ListPemusnahanBarang from "layouts/pemusnahan-barang/list-pemusnahan-barang";
import StokOpname from "layouts/stok-opname";
import InventoryAging from "layouts/report/inventory-aging";
import PengirimanBarang from "layouts/report/pengiriman-barang";
import PenerimaanBarang from "layouts/report/penerimaan-barang";
import DashboardAdmin from "layouts/dashboard/dashboard-admin";
import ChangePassword from "layouts/change-password";
import GenerateBarangRusak from "layouts/barang-rusak";
import ListBarangRusak from "layouts/barang-rusak/list-barang-rusak";
import SignUp from "layouts/authentication/sign-up";

// @mui iconsππ
import Icon from "@mui/material/Icon";
import PemusnahanBarang from "layouts/pemusnahan-barang";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
// import SidenavCollapseBuatan from "examples/Sidenav/SidenavCollapseBuatan";
import { Shop } from "@mui/icons-material";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["2", "1"],
  },
  {
    type: "collapse",
    name: "Dashboard Admin",
    key: "dashboard-admin",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-admin",
    component: <DashboardAdmin />,
    roles: ["3"],
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  //   roles: ["1"],
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  //   roles: ["1"],
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  //   roles: ["1", "2"],
  // },
  {
    type: "collapse",
    name: "Barang Masuk",
    key: "barang-masuk",
    icon: <Icon fontSize="small">warehouse</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Barang Masuk",
        key: "generate-barang-masuk",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/barang-masuk",
        component: <BarangMasuk />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Barang Masuk",
        key: "approval-barang-masuk",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/approval-barang-masuk",
        component: <ApprovalBarangMasuk />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Barang Masuk",
        key: "list-barang-masuk",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/list-barang-masuk",
        component: <ListBarangMasuk />,
        roles: ["1", "2"],
      },
    ],
  },

  {
    type: "collapse",
    name: "Barang Keluar",
    key: "barang-keluar",
    icon: <Icon fontSize="small">notifications</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Barang Keluar",
        key: "barang-keluar",
        icon: <Icon fontSize="small">inventory</Icon>,
        route: "/barang-keluar",
        component: <BarangKeluar />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Barang Keluar",
        key: "approval-barang-keluar",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/approval-barang-keluar",
        component: <ApprovalBarangKeluar />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Barang Keluar",
        key: "list-barang-keluar",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/list-barang-keluar",
        component: <ListBarangKeluar />,
        roles: ["1", "2"],
      },
    ],
  },

  {
    type: "collapse",
    name: "Mutasi Barang",
    key: "mutasi-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Mutasi Barang",
        key: "generate-mutasi-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/mutasi-barang",
        component: <GenerateMutasi />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Mutasi Barang",
        key: "approval-mutasi-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/approval-mutasi-barang",
        component: <ApprovalMutasi />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Mutasi Barang",
        key: "list-mutasi-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/list-mustasi-barang",
        component: <ListMutasiBarang />,
        roles: ["1", "2"],
      },
    ],
  },

  {
    type: "collapse",
    name: "Pemusnahan Barang",
    key: "pemusnahan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    children: [
      {
        type: "collapse",
        name: "Buat Pemusnahan Barang",
        key: "generate-pemusnahan-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/pemusnahan-barang",
        component: <PemusnahanBarang />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Pemusnahan",
        key: "approval-pemusnahan-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/approval-pemusnahan-barang",
        component: <ApprovalPemusnahanBarang />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Pemusnahan Barang",
        key: "list-pemusnahan-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/list-pemusnahan-barang",
        component: <ListPemusnahanBarang />,
        roles: ["1", "2"],
      },
    ],
  },

  {
    type: "collapse",
    name: "Surat Jalan",
    key: "surat-jalan",
    icon: <Icon fontSize="small">warehouse</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Surat Jalan",
        key: "generate-surat-jalan",
        icon: <Icon fontSize="small">local_shipping</Icon>,
        route: "/generate-surat-jalan",
        component: <GenerateSuratJalan />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Surat Jalan",
        key: "approval-surat-jalan",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/approval-surat-jalan",
        component: <ApprovalSuratJalan />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Surat Jalan",
        key: "list-surat-jalan",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/list-surat-jalan",
        component: <ListSuratJalan />,
        roles: ["1", "2"],
      },
    ],
  },

  {
    type: "collapse",
    name: "Barang Rusak",
    key: "barang-rusak",
    icon: <Icon fontSize="small">warehouse</Icon>,
    children: [
      {
        type: "collapse",
        name: "Pelaporan Barang Rusak",
        key: "pelaporan-barang-rusak",
        icon: <Icon fontSize="small">local_shipping</Icon>,
        route: "/pelaporan-barang-rusak",
        component: <GenerateBarangRusak />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "List Barang Rusak",
        key: "list-barang-rusak",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/list-barang-rusak",
        component: <ListBarangRusak />,
        roles: ["1", "2"],
      },
    ],
  },

  {
    type: "route",
    name: "Barang Keluar",
    key: "barang-keluar-routes",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/barang-keluar",
    component: <BarangKeluar />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Barang Masuk",
    key: "barang-masuk",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/barang-masuk",
    component: <BarangMasuk />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Mutasi Barang",
    key: "mutasi-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/mutasi-barang",
    component: <GenerateMutasi />,
    roles: ["2", "1"],
  },
  {
    type: "collapse",
    name: "Packaging",
    key: "packaging-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/packaging-barang",
    component: <GeneratePackaging />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Pemusnahan Barang",
    key: "pemusnahan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/pemusnahan-barang",
    component: <PemusnahanBarang />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Generate Surat Jalan",
    key: "generate-surat-jalan",
    icon: <Icon fontSize="small">local_shipping</Icon>,
    route: "/generate-surat-jalan",
    component: <GenerateSuratJalan />,
    roles: ["2", "1"],
  },
  {
    type: "collapse",
    name: "Stok Opname",
    key: "stok-opname",
    icon: <Icon fontSize="small">local_shipping</Icon>,
    route: "/stok-opname",
    component: <StokOpname />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Pelaporan Barang Rusak",
    key: "pelaporan-barang-rusak",
    icon: <Icon fontSize="small">local_shipping</Icon>,
    route: "/pelaporan-barang-rusak",
    component: <GenerateBarangRusak />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Approval Barang Keluar",
    key: "approval-barang-keluar-routes",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/approval-barang-keluar",
    component: <ApprovalBarangKeluar />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Surat Jalan",
    key: "approval-surat-jalan",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/approval-surat-jalan",
    component: <ApprovalSuratJalan />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Barang Masuk",
    key: "approval-barang-masuk",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/approval-barang-masuk",
    component: <ApprovalBarangMasuk />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Mutasi Barang",
    key: "approval-mutasi-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/approval-mutasi-barang",
    component: <ApprovalMutasi />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Pemusnahan",
    key: "approval-pemusnahan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/approval-pemusnahan-barang",
    component: <ApprovalPemusnahanBarang />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "List Barang Masuk",
    key: "list-barang-masuk",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/list-barang-masuk",
    component: <ListBarangMasuk />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Barang Keluar",
    key: "list-barang-keluar-routes",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/list-barang-keluar",
    component: <ListBarangKeluar />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Surat Jalan",
    key: "list-surat-jalan",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/list-surat-jalan",
    component: <ListSuratJalan />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Mutasi Barang",
    key: "list-mutasi-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/list-mustasi-barang",
    component: <ListMutasiBarang />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Pemusnahan Barang",
    key: "list-pemusnahan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/list-pemusnahan-barang",
    component: <ListPemusnahanBarang />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Barang Rusak",
    key: "list-barang-rusak",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/list-barang-rusak",
    component: <ListBarangRusak />,
    roles: ["1", "2"],
  },
  {
    type: "collapse",
    name: "Rak Penyimpanan Barang",
    key: "rak-penyimpanan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/rak-penyimpanan-barang",
    component: <MasterPositioning />,
    roles: ["1", "2"],
  },

  {
    type: "collapse",
    name: "Report",
    key: "report",
    icon: <Icon fontSize="small">warehouse</Icon>,
    roles: ["2"],
    children: [
      {
        type: "collapse",
        name: "Kartu Stok",
        key: "kartu-stok",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/kartu-stok",
        component: <KartuStok />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "Lacak Pergerakan Barang",
        key: "pergerakan-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/pergerakan-barang",
        component: <PergerakanBarang />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "Inventory Aging",
        key: "inventory-aging",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/inventory-aging",
        component: <InventoryAging />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Pengiriman Barang",
        key: "pengiriman-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/pengiriman-barang",
        component: <PengirimanBarang />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Penerimaan Barang",
        key: "penerimaan-barang",
        icon: <Icon fontSize="small">warehouse</Icon>,
        route: "/penerimaan-barang",
        component: <PenerimaanBarang />,
        roles: ["2", "1"],
      },
    ],
  },

  {
    type: "route",
    name: "Kartu Stok",
    key: "kartu-stok",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/kartu-stok",
    component: <KartuStok />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Lacak Pergerakan Barang",
    key: "pergerakan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/pergerakan-barang",
    component: <PergerakanBarang />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Inventory Aging",
    key: "inventory-aging",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/inventory-aging",
    component: <InventoryAging />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Pengiriman Barang",
    key: "pengiriman-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/pengiriman-barang",
    component: <PengirimanBarang />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Penerimaan Barang",
    key: "penerimaan-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/penerimaan-barang",
    component: <PenerimaanBarang />,
    roles: ["2", "1"],
  },
  {
    type: "collapse",
    name: "Master Barang",
    key: "master-barang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/master-barang",
    component: <MasterBarang />,
    roles: ["3"],
  },
  {
    type: "collapse",
    name: "Master Gudang",
    key: "master-gudang",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/master-Gudang",
    component: <MasterGudang />,
    roles: ["3"],
  },
  {
    type: "collapse",
    name: "Master Pengguna",
    key: "master-pengguna",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/master-pengguna",
    component: <MasterPengguna />,
    roles: ["3"],
  },

  {
    type: "collapse",
    name: "Master Customer",
    key: "master-customer",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/master-customer",
    component: <MasterCustomer />,
    roles: ["3"],
  },

  {
    type: "collapse",
    name: "Change Password",
    key: "change-password",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/change-password",
    component: <ChangePassword />,
    roles: ["3", "1", "2"],
  },

  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

export default routes;
