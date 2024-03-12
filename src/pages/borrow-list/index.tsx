import { Container, Grid, Table } from "@mantine/core";
import { Athiti } from "next/font/google";
import Head from "next/head";
import styled from "@emotion/styled";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const athiti = Athiti({
  weight: "400", // if single weight, otherwise you use array like [400, 500, 700],
  style: "normal", // if single style, otherwise you use array like ['normal', 'italic']
  subsets: ["latin"],
});

const Layout = styled(Grid)`
  padding: 30px 40px;
  border-radius: 16px;
  .mantine-Grid-inner {
    height: 100%;
  }
`;

const thItems = [
  "Employee ID (รหัสพนักงาน) *",
  "Full name (ชื่อ สกุล) *",
  "Position (ตำแหน่ง) *",
  "Section (หน่วยงาน) *",
  "Tel (เบอร์ติดต่อ) *",
  "Equipment (อุปกรณ์ที่ต้องการยืม) *",
  "Unit (จำนวน) *",
  "Purpose (วัตถุประสงค์การใช้งาน) *",
  "Date time start (วันเวลา เริ่มใช้งาน) *",
  "Date time end (วันเวลา สิ้นสุดใช้งาน) *",
  "Location (สถานที่ใช้งาน) *",
];

const ths = (
  <Table.Tr>
    {thItems.map((item) => (
      <Table.Th key={item}>{item}</Table.Th>
    ))}
  </Table.Tr>
);

export default function Page() {
  const supabaseClient = useSupabaseClient();
  const [borrow, setBorrow] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabaseClient.from("borrow").select("*");
      if (!data) {
        setBorrow([]);
      }
      setBorrow(data);
    })();
  }, [supabaseClient]);

  const rows = useMemo(() => {
    return borrow.map((element: any) => (
      <Table.Tr key={element.employee_id}>
        <Table.Td>{element.employee_id}</Table.Td>
        <Table.Td>{element.full_name}</Table.Td>
        <Table.Td>{element.position}</Table.Td>
        <Table.Td>{element.department}</Table.Td>
        <Table.Td>{element.tel}</Table.Td>
        <Table.Td>{element.equipment}</Table.Td>
        <Table.Td>{element.number}</Table.Td>
        <Table.Td>{element.purpose}</Table.Td>
        <Table.Td>{element.start_date_time}</Table.Td>
        <Table.Td>{element.end_date_time}</Table.Td>
        <Table.Td>{element.location}</Table.Td>
      </Table.Tr>
    ));
  }, [borrow]);

  return (
    <>
      <Head>
        <title>Borrow List</title>
      </Head>

      <Container
        className={athiti.className}
        fluid
        h={`100vh`}
        w={`100%`}
        bg="#ececc6"
        p={50}
      >
        <Layout h={`100%`} w={`100%`} bg="#ffffff">
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Layout>
      </Container>
    </>
  );
}
