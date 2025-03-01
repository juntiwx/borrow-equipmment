import styled from "@emotion/styled";
import { useForm } from "@mantine/form";
import {
  NumberInput,
  TextInput,
  Button,
  Box,
  Container,
  NativeSelect,
  Grid,
  GridCol,
  Image,
  Center,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { InputPayload } from "../types";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useMemo, useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { Athiti } from "next/font/google";

const athiti = Athiti({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const athitiTitle = Athiti({
  weight: "500",
  style: "normal",
  subsets: ["latin"],
});

const API = process.env.NEXT_PUBLIC_API_ENTPOINT;

const FormProvider = styled(Grid)`
  padding: 30px 40px;
  border-radius: 16px;
  .mantine-Grid-inner {
    height: 100%;
  }
`;

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Select = styled(NativeSelect)`
  .mantine-NativeSelect-input > option:first-of-type {
    display: none;
  }
`;

const Checkcondition = (condition: boolean, ans: string): string | null => {
  return condition ? ans : null;
};

// เพิ่ม key computers เพื่อเก็บ array ของ dynamic fields (computer name & asset number)
const init = {
  employee_id: "",
  full_name: "",
  position: "",
  department: "",
  tel: "",
  equipment: "",
  number: 0,
  purpose: "",
  location: "",
  start_date_time: null,
  end_date_time: null,
  computers: [] // ตัวอย่าง: [{ computer_name: "", asset_number: "" }]
};

type initType = typeof init;
const CheckObject = (obj1: initType, obj2: any): boolean => {
  return !Object.entries(obj1)
    .map(([k, v]) => {
      return obj2[k] !== v;
    })
    .includes(false);
};

function ContactUs() {
  // state สำหรับเก็บ options ของ department และ equipment
  const [departmentOptions, setDepartmentOptions] = useState(["เลือกตัวเลือก"]);
  const [equipmentOptions, setEquipmentOptions] = useState(["เลือกตัวเลือก"]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูล options จาก Google Sheet (select_option)
  useEffect(() => {
    const sheetId = "1LK4Uz0gJC57zF2zvnDowkh1ZFPzi6sguKaPweZYxaqk";
    const sheetName = "select_option";
    const query = "select A, B";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}&tq=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.text())
      .then(text => {
        const jsonData = JSON.parse(text.substr(47).slice(0, -2));
        const deptOptions: string[] = [];
        const equipOptions: string[] = [];
        // ข้าม header ด้วย slice(1)
        jsonData.table.rows.slice(1).forEach(row => {
          if (row.c) {
            const aVal = row.c[0]?.v;
            const bVal = row.c[1]?.v;
            if (aVal) {
              deptOptions.push(aVal);
            }
            if (bVal) {
              equipOptions.push(bVal);
            }
          }
        });
        setDepartmentOptions(["เลือกตัวเลือก", ...deptOptions]);
        setEquipmentOptions(["เลือกตัวเลือก", ...equipOptions]);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // กำหนด input fields เบื้องต้น (ไม่รวม dynamic fields สำหรับ computers)
  const inputItems: InputPayload = {
    employee_id: {
      name: "Employee ID (รหัสพนักงาน) *",
      component: TextInput,
    },
    full_name: {
      name: "Full name (ชื่อ สกุล) *",
      component: TextInput,
    },
    position: {
      name: "Position (ตำแหน่ง) *",
      component: TextInput,
    },
    department: {
      name: "Section (หน่วยงาน) *",
      component: Select,
      options: departmentOptions,
    },
    tel: {
      name: "Tel (เบอร์ติดต่อ) *",
      component: TextInput,
    },
    equipment: {
      name: "Equipment (อุปกรณ์ที่ต้องการยืม) *",
      component: Select,
      options: equipmentOptions,
    },
    number: {
      name: "Unit (จำนวน) *",
      component: NumberInput,
    },
    purpose: {
      name: "Purpose (วัตถุประสงค์การใช้งาน) *",
      component: TextInput,
    },
    start_date_time: {
      name: "Date time start (วันเวลา เริ่มใช้งาน) *",
      component: DateTimePicker,
    },
    end_date_time: {
      name: "Date time end (วันเวลา สิ้นสุดใช้งาน) *",
      component: DateTimePicker,
    },
    location: {
      name: "Location (สถานที่ใช้งาน) *",
      component: TextInput,
    },
  };

  const form = useForm({
    initialValues: init,
    validate: {
      employee_id: (value) =>
        Checkcondition(!/^\d{8}$/.test(`${value}`), "โปรดระบุรหัสพนักงานให้ถูกต้อง"),
      full_name: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดระบุข้อมูลชื่อผู้ยืมอุปกรณ์ให้ถูกต้อง"),
      position: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดระบุตำแหน่งให้ถูกต้อง"),
      department: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดระบุหน่วยงานให้ถูกต้อง"),
      tel: (value) =>
        Checkcondition(!/^\d{4,10}$/.test(`${value}`), "โปรดระบุข้อมูลเบอร์ผู้ติดต่อให้ถูกต้อง"),
      equipment: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดระบุอุปกรณ์ที่ยืมให้ถูกต้อง"),
      number: (value) =>
        Checkcondition(value < 1, "โปรดระบุจำนวนให้ถูกต้อง"),
      purpose: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดระบุเหตุผลการยืมให้ถูกต้อง"),
      location: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดระบุสถานที่ยืมให้ถูกต้อง"),
      start_date_time: (value, values) => {
        const start = dayjs(value);
        const end = dayjs(values.end_date_time);
        return Checkcondition(!start.isBefore(end) || value == null, "โปรดระบุวันที่เริ่มยืมให้ถูกต้อง");
      },
      end_date_time: (value, values) => {
        const start = dayjs(values.start_date_time);
        const end = dayjs(value);
        return Checkcondition(!end.isAfter(start) || value == null, "โปรดสิ้นสุดการยืมให้ถูกต้อง");
      },
      // Validate สำหรับ dynamic fields computers
      computers: (value) => {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].computer_name.trim().length < 1 || value[i].asset_number.trim().length < 1) {
              return "โปรดระบุข้อมูล Computer Name และ Asset Number ให้ครบถ้วน";
            }
          }
        }
        return null;
      },
    },
  });

  // เมื่อค่า number เปลี่ยน ให้ปรับปรุง array ของ computers ตามจำนวนที่กรอก
  useEffect(() => {
    const count = form.values.number;
    const currentComputers = form.values.computers || [];
    let computerItems = [...currentComputers];
    if (computerItems.length < count) {
      // เพิ่มรายการใหม่
      for (let i = computerItems.length; i < count; i++) {
        computerItems.push({ computer_name: "", asset_number: "" });
      }
    } else if (computerItems.length > count) {
      // ตัดรายการส่วนเกินออก
      computerItems = computerItems.slice(0, count);
    }
    form.setFieldValue("computers", computerItems);
  }, [form.values.number]);

  const AddRow = async (data: any) => {
    setLoading(true);
    dayjs.locale("th");
    const startDateTime = dayjs(data.start_date_time).add(543, "year");
    const endDateTime = dayjs(data.end_date_time).add(543, "year");
    const currentDate = dayjs().add(543, "year");

    const formattedStartDateTime = startDateTime.format("D เดือน MMMM ปี YYYY เวลา HH:mm น.");
    const formattedEndDateTime = endDateTime.format("D เดือน MMMM ปี YYYY เวลา HH:mm น.");
    const formattedCurrentDate = currentDate.format("D เดือน MMMM ปี YYYY");
    const currentTime = currentDate.format("HH:mm");

    // สมมติรองรับ dynamic field สำหรับ computers 2 คู่
    const maxComputers = 2;

    // สร้าง row array โดยเรียงลำดับให้ตรงตาม column ที่กำหนดไว้
    // ลำดับ: employee_id, full_name, template, position, department, tel, equipment, number,
    // purpose, location, start_date_time, end_date_time, date_request, time_request
    const row = [
      data.employee_id,
      data.full_name,
      data.template || "", // หากไม่มีข้อมูล template ส่งค่าว่าง
      data.position,
      data.department,
      data.tel,
      data.equipment,
      data.number,
      data.purpose,
      data.location,
      formattedStartDateTime,
      formattedEndDateTime,
      formattedCurrentDate,
      currentTime,
    ];

    // เติมข้อมูลสำหรับ dynamic fields: computer_name_i และ asset_number_i
    for (let i = 0; i < maxComputers; i++) {
      if (data.computers && data.computers[i]) {
        row.push(data.computers[i].computer_name || "");
        row.push(data.computers[i].asset_number || "");
      } else {
        row.push("");
        row.push("");
      }
    }

    try {
      await fetch(`${API}`, {
        method: "POST",
        body: JSON.stringify(row),
      });
      notifications.show({
        title: "แจ้งผลดำเนินการ",
        message: "ขอคำร้องสำเร็จ",
      });
      setLoading(false);
    } catch (error) {
      notifications.show({
        title: "แจ้งผลดำเนินการ",
        message: "ขอคำร้องไม่สำเร็จ",
        color: "red",
      });
      console.error(error);
      setLoading(false);
    }
  };



  // Render fields ที่กำหนดไว้ใน inputItems
  const renderInputList = Object.entries(inputItems).map(([k, v], i) => {
    return (
      <GridCol span={6} key={`${k}-${i}`}>
        <v.component
          label={v.name}
          data={v.options}
          placeholder={v.name}
          {...form.getInputProps(`${k}`)}
        />
      </GridCol>
    );
  });

  // Render dynamic fields สำหรับ computer name และ asset number
  const renderComputerFields = form.values.computers.map((item: any, index: number) => (
    <GridCol span={6} key={`computer-${index}`}>
      <TextInput
        label={`Computer Name ${index + 1}`}
        placeholder="Computer Name"
        {...form.getInputProps(`computers.${index}.computer_name`)}
      />
      <TextInput
        label={`Asset Number ${index + 1}`}
        placeholder="Asset Number"
        {...form.getInputProps(`computers.${index}.asset_number`)}
      />
    </GridCol>
  ));

  const valid = useMemo(() => CheckObject(init, form.values), [form.values]);

  return (
    <Container className={athiti.className} fluid h={`100vh`} w={`100%`} bg="#ececc6" p={50}>
      <FormProvider h={`100%`} w={`100%`} bg="#ffffff">
        <Box component={GridCol} span={6}>
          <Center h={`100%`}>
            <Image radius="lg" src={"/logo.png"} w={"90%"} />
          </Center>
        </Box>
        <Box component={GridCol} span={6} h={`100%`} display={"flex"}>
          <Form onSubmit={form.onSubmit(AddRow)}>
            <Title className={athitiTitle.className} size="h3">
              เพิ่มรายการที่ต้องการยืมอุปกรณ์ IT 
            </Title>
            <Grid h={`80%`} py={20}>
              {renderInputList}
              {renderComputerFields}
            </Grid>
            <br />
            <a 
              href="https://docs.google.com/spreadsheets/d/1LK4Uz0gJC57zF2zvnDowkh1ZFPzi6sguKaPweZYxaqk/edit" 
              target="_blank"
            >
              รายการข้อมูล โปรด Click !!
            </a>
            <Button
              className={`btn ${!valid ? "hidden" : ""}`}
              type="submit"
              mt="lg"
              w={"50%"}
              variant="gradient"
              loading={loading}
              gradient={{ from: "#3f9c85", to: "#1d566a", deg: 100 }}
              disabled={!valid}
            >
              Submit
            </Button>
          </Form>
        </Box>
      </FormProvider>
    </Container>
  );
}

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default ContactUs;
