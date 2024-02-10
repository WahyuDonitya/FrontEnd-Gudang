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

  // API
  const getCountSuratJalan = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/suratjalan/get-suratjalan-send-today`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountSuratJalanSend(response.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data count surat jalan : ", error);
    }
  };
  // End API

  useEffect(() => {
    getCountSuratJalan();
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
          icon="notifications"
          title={`${countSuratJalanSend} surat jalan harus dikirim`}
          dateTime={formattedDate}
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="New order #1832412"
          dateTime={formattedDate}
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Server payments for April"
          dateTime={formattedDate}
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="New card added for order #4395133"
          dateTime={formattedDate}
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="New card added for order #4395133"
          dateTime={formattedDate}
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
