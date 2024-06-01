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

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import dayjs from "dayjs";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { useEffect, useState } from "react";

function OrdersOverview() {
  const accessToken = localStorage.getItem("access_token");
  const [countSuratJalanSend, setCountSuratJalanSend] = useState([]);
  const [countPemusnahanToday, setCountPemusnahanToday] = useState([]);
  const [countHbarangrusak, setHbarangrusak] = useState(0);
  const [countHbarangKeluaresok, setCountHbarangKeluaresok] = useState(0);
  const [countSuratJalanTransfer, setCountSuratJalanTransfer] = useState(0);
  const [countBarangDilihat, setCountBarangDilihat] = useState(0);
  const [countMutasiBesok, setCountMutasiBesok] = useState(0);

  // API

  // const getMutasiBesok = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://api.tahupoosby.com/api/gudang/get-mutasibarang-send-tommorow`,
  //       { headers: { Authorization: `Bearer ${accessToken}` } }
  //     );
  //     setCountMutasiBesok(response.data);
  //   } catch (error) {
  //     console.log("Terdapat kesalahan saat mengambil data count surat jalan : ", error);
  //   }
  // };

  const getCountSuratJalan = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/suratjalan/get-suratjalan-send-today`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountSuratJalanSend(response.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data count surat jalan : ", error);
    }
  };

  const getCountPemusnahan = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/pemusnahan-barang/get-pemusnahanbarang-today`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountPemusnahanToday(response.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data count surat pemusnahan : ", error);
    }
  };

  const getCountHbarangRusak = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/barang-rusak/get-hbarang-rusak-count`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHbarangrusak(response.data);
    } catch (error) {
      console.log("Terdapat error saat melakukan pengambilan data hbarang rusak ".error);
    }
  };

  const getcountHbarangKeluarBesok = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/transaksi-barang/barang-keluar-send-tommorow",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountHbarangKeluaresok(response.data);
    } catch (error) {
      console.log("gagal saat ingin mengambil data hbarang keluar besok");
    }
  };

  const getcountSuratJalanTransfer = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/suratjalan/get-suratjalan-transfer-send-today",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountSuratJalanTransfer(response.data);
    } catch (error) {
      console.log("gagal saat ingin mengambil data surat jalan ", error);
    }
  };

  const getcountPermintaanBarang = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/permintaan/get-count-belum-dilihat",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountBarangDilihat(response.data);
    } catch (error) {
      console.log("terdapat kesalahan ", error);
    }
  };
  // End API

  useEffect(() => {
    getCountSuratJalan();
    getCountPemusnahan();
    getCountHbarangRusak();
    getcountHbarangKeluarBesok();
    getcountSuratJalanTransfer();
    getcountPermintaanBarang();
    // getMutasiBesok();
  }, []);

  const today = new Date();
  const formattedDate = dayjs(today).format("DD MMMM YYYY");
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Pengingat Hari Ini
        </MDTypography>
        {/* <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
          </MDTypography>
        </MDBox> */}
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon={<Icon>local_shipping</Icon>}
          title={`${countSuratJalanSend} surat jalan harus dikirim`}
          dateTime={formattedDate}
        />
        <TimelineItem
          color="primary"
          icon={<Icon>local_shipping</Icon>}
          title={`${countSuratJalanTransfer} Surat Jalan Transfer harus dikirim`}
          dateTime={formattedDate}
        />
        <TimelineItem
          color="error"
          icon={<Icon>delete</Icon>}
          title={`${countPemusnahanToday} Harus dimusnahkan`}
          dateTime={formattedDate}
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title={`${countHbarangrusak} List barang rusak belum dilihat`}
          dateTime={formattedDate}
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title={`${countHbarangKeluaresok} Barang keluar untuk besok`}
          dateTime={formattedDate}
        />
        {/* <TimelineItem
          color="warning"
          icon="payment"
          title={`${countMutasiBesok} Mutasi Barang untuk besok`}
          dateTime={formattedDate}
        /> */}
        <TimelineItem
          color="warning"
          icon="payment"
          title={`${countBarangDilihat} Permintaan Barang baru belum dilihat`}
          dateTime={formattedDate}
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
