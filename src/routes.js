import Dashboard from "layouts/dashboard";
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
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import SignUp from "layouts/authentication/sign-up";

// @mui iconsππ
import Icon from "@mui/material/Icon";
import PemusnahanBarang from "layouts/pemusnahan-barang";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
// import SidenavCollapseBuatan from "examples/Sidenav/SidenavCollapseBuatan";
import { Shop } from "@mui/icons-material";
import GeneratePermintaanBarang from "layouts/permintaan-barang/generate-permintaan-barang";
import ListPermintaanBarang from "layouts/permintaan-barang/list-permintaan-barang";

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
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/barang-masuk",
        component: <BarangMasuk />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Barang Masuk",
        key: "approval-barang-masuk",
        icon: <Icon fontSize="small">check_circle</Icon>,
        route: "/approval-barang-masuk",
        component: <ApprovalBarangMasuk />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Barang Masuk",
        key: "list-barang-masuk",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
        route: "/list-barang-masuk",
        component: <ListBarangMasuk />,
        roles: ["1", "2"],
      },
    ],
  },

  // Barang Keluar
  {
    type: "collapse",
    name: "Barang Keluar",
    key: "barang-keluar",
    icon: <Icon fontSize="small">outbox</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Barang Keluar",
        key: "generate-barang-keluar",
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/barang-keluar",
        component: <BarangKeluar />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Barang Keluar",
        key: "approval-barang-keluar",
        icon: <Icon fontSize="small">check_circle</Icon>,
        route: "/approval-barang-keluar",
        component: <ApprovalBarangKeluar />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Barang Keluar",
        key: "list-barang-keluar",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
        route: "/list-barang-keluar",
        component: <ListBarangKeluar />,
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
    name: "Approval Barang Keluar",
    key: "approval-barang-keluar-routes",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/approval-barang-keluar",
    component: <ApprovalBarangKeluar />,
    roles: ["2"],
  },

  {
    type: "route",
    name: "List Barang Keluar",
    key: "list-barang-keluar-routes",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    route: "/list-barang-keluar",
    component: <ListBarangKeluar />,
    roles: ["1", "2"],
  },

  // End Barang Keluar

  {
    type: "collapse",
    name: "Mutasi Barang",
    key: "mutasi-barang",
    icon: <Icon fontSize="small">shuffle</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Mutasi Barang",
        key: "generate-mutasi-barang",
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/mutasi-barang",
        component: <GenerateMutasi />,
        roles: ["2", "1"],
        jenis_gudang: ["1"],
      },
      {
        type: "collapse",
        name: "Approval Mutasi Barang",
        key: "approval-mutasi-barang",
        icon: <Icon fontSize="small">check_circle</Icon>,
        route: "/approval-mutasi-barang",
        component: <ApprovalMutasi />,
        roles: ["2"],
        jenis_gudang: ["1"],
      },
      {
        type: "collapse",
        name: "List Mutasi Barang",
        key: "list-mutasi-barang",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
        route: "/list-mutasi-barang",
        component: <ListMutasiBarang />,
        roles: ["1", "2"],
        jenis_gudang: ["1"],
      },
    ],
  },

  {
    type: "collapse",
    name: "Permintaan Barang",
    key: "permintaan-barang",
    icon: <ShoppingBasketIcon fontSize="small" />,
    children: [
      {
        type: "collapse",
        name: "Permintaan Barang",
        key: "generate-permintaan-barang",
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/generate-permintaan-barang",
        component: <GeneratePermintaanBarang />,
        roles: ["2"],
        jenis_gudang: ["2"],
      },
      {
        type: "collapse",
        name: "List Permintaan Barang",
        key: "list-permintaan-barang",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
        route: "/list-permintaan-barang",
        component: <ListPermintaanBarang />,
        roles: ["2"],
      },
    ],
  },

  {
    type: "route",
    name: "Request Barang",
    key: "generate-permintaan-barang",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/generate-permintaan-barang",
    component: <GeneratePermintaanBarang />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "List Permintaan Barang",
    key: "list-permintaan-barang",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/list-permintaan-barang",
    component: <ListPermintaanBarang />,
    roles: ["2"],
  },

  {
    type: "collapse",
    name: "Pemusnahan Barang",
    key: "pemusnahan-barang",
    icon: <Icon fontSize="small">delete_forever</Icon>,
    children: [
      {
        type: "collapse",
        name: "Buat Pemusnahan Barang",
        key: "generate-pemusnahan-barang",
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/pemusnahan-barang",
        component: <PemusnahanBarang />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Pemusnahan",
        key: "approval-pemusnahan-barang",
        icon: <Icon fontSize="small">check_circle</Icon>,
        route: "/approval-pemusnahan-barang",
        component: <ApprovalPemusnahanBarang />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Pemusnahan Barang",
        key: "list-pemusnahan-barang",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
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
    icon: <Icon fontSize="small">local_shipping</Icon>,
    children: [
      {
        type: "collapse",
        name: "Generate Surat Jalan",
        key: "generate-surat-jalan",
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/generate-surat-jalan",
        component: <GenerateSuratJalan />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "Approval Surat Jalan",
        key: "approval-surat-jalan",
        icon: <Icon fontSize="small">check_circle</Icon>,
        route: "/approval-surat-jalan",
        component: <ApprovalSuratJalan />,
        roles: ["2"],
      },
      {
        type: "collapse",
        name: "List Surat Jalan",
        key: "list-surat-jalan",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
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
    icon: <Icon fontSize="small">broken_image</Icon>,
    children: [
      {
        type: "collapse",
        name: "Pelaporan Barang Rusak",
        key: "pelaporan-barang-rusak",
        icon: <Icon fontSize="small">add_box</Icon>,
        route: "/pelaporan-barang-rusak",
        component: <GenerateBarangRusak />,
        roles: ["2", "1"],
      },
      {
        type: "collapse",
        name: "List Barang Rusak",
        key: "list-barang-rusak",
        icon: <Icon fontSize="small">format_list_bulleted</Icon>,
        route: "/list-barang-rusak",
        component: <ListBarangRusak />,
        roles: ["1", "2"],
      },
    ],
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
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/mutasi-barang",
    component: <GenerateMutasi />,
    roles: ["2", "1"],
  },

  {
    type: "collapse",
    name: "Packaging",
    key: "packaging-barang",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    route: "/packaging-barang",
    component: <GeneratePackaging />,
    roles: ["2", "1"],
    jenis_gudang: ["1"],
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
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/generate-surat-jalan",
    component: <GenerateSuratJalan />,
    roles: ["2", "1"],
  },
  {
    type: "collapse",
    name: "Stok Opname",
    key: "stok-opname",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/stok-opname",
    component: <StokOpname />,
    roles: ["2", "1"],
  },
  {
    type: "route",
    name: "Pelaporan Barang Rusak",
    key: "pelaporan-barang-rusak",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/pelaporan-barang-rusak",
    component: <GenerateBarangRusak />,
    roles: ["2", "1"],
  },

  {
    type: "route",
    name: "Approval Surat Jalan",
    key: "approval-surat-jalan",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/approval-surat-jalan",
    component: <ApprovalSuratJalan />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Barang Masuk",
    key: "approval-barang-masuk",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/approval-barang-masuk",
    component: <ApprovalBarangMasuk />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Mutasi Barang",
    key: "approval-mutasi-barang",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/approval-mutasi-barang",
    component: <ApprovalMutasi />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "Approval Pemusnahan",
    key: "approval-pemusnahan-barang",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/approval-pemusnahan-barang",
    component: <ApprovalPemusnahanBarang />,
    roles: ["2"],
  },
  {
    type: "route",
    name: "List Barang Masuk",
    key: "list-barang-masuk",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    route: "/list-barang-masuk",
    component: <ListBarangMasuk />,
    roles: ["1", "2"],
  },

  {
    type: "route",
    name: "List Surat Jalan",
    key: "list-surat-jalan",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    route: "/list-surat-jalan",
    component: <ListSuratJalan />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Mutasi Barang",
    key: "list-mutasi-barang",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    route: "/list-mutasi-barang",
    component: <ListMutasiBarang />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Pemusnahan Barang",
    key: "list-pemusnahan-barang",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    route: "/list-pemusnahan-barang",
    component: <ListPemusnahanBarang />,
    roles: ["1", "2"],
  },
  {
    type: "route",
    name: "List Barang Rusak",
    key: "list-barang-rusak",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    route: "/list-barang-rusak",
    component: <ListBarangRusak />,
    roles: ["1", "2"],
  },
  {
    type: "collapse",
    name: "Rak Penyimpanan Barang",
    key: "rak-penyimpanan-barang",
    icon: <Icon fontSize="small">view_module</Icon>,
    route: "/rak-penyimpanan-barang",
    component: <MasterPositioning />,
    roles: ["2"],
  },

  {
    type: "collapse",
    name: "Report",
    key: "report",
    icon: <Icon fontSize="small">insert_chart</Icon>,
    roles: ["2"],
    children: [
      {
        type: "collapse",
        name: "Kartu Stok",
        key: "kartu-stok",
        icon: <Icon fontSize="small">receipt</Icon>,
        route: "/kartu-stok",
        component: <KartuStok />,
        roles: ["2", "3"],
      },
      {
        type: "collapse",
        name: "Lacak Pergerakan Barang",
        key: "pergerakan-barang",
        icon: <Icon fontSize="small">timeline</Icon>,
        route: "/pergerakan-barang",
        component: <PergerakanBarang />,
        roles: ["2", "3"],
      },
      {
        type: "collapse",
        name: "Inventory Aging",
        key: "inventory-aging",
        icon: <Icon fontSize="small">access_time</Icon>,
        route: "/inventory-aging",
        component: <InventoryAging />,
        roles: ["2", "1", "3"],
      },
      {
        type: "collapse",
        name: "Pengiriman Barang",
        key: "pengiriman-barang",
        icon: <Icon fontSize="small">send</Icon>,
        route: "/pengiriman-barang",
        component: <PengirimanBarang />,
        roles: ["2", "1", "3"],
      },
      {
        type: "collapse",
        name: "Penerimaan Barang",
        key: "penerimaan-barang",
        icon: <Icon fontSize="small">archive</Icon>,
        route: "/penerimaan-barang",
        component: <PenerimaanBarang />,
        roles: ["2", "1", "3"],
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
    icon: <Icon fontSize="small">enhanced_encryption</Icon>,
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
