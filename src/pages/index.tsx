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
import _ from "lodash";
import { useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";

const API = process.env.NEXT_PUBLIC_API_ENTPOINT;
const FormProvider = styled(Grid)`
  padding: 30px 40px;
  border-radius: 16px;
  .mantine-Grid-inner {
    height: 100%;
  }
`;

const Form = styled.form`
  height: "100%";
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

const inputItems: InputPayload = {
  employee_id: {
    name: "รหัสพนักงาน",
    component: TextInput,
  },
  full_name: {
    name: "ชื่อ สกุล",
    component: TextInput,
  },
  position: {
    name: "ตำแหน่ง",
    component: TextInput,
  },
  department: {
    name: "หน่วยงาน",
    component: Select,
    options: ["เลือกตัวเลือก", "งานเทคโนโลยีสารสนเทศ", "งานเทคโนโลยีการศึกษา"],
  },
  tel: {
    name: "เบอร์ติดต่อ",
    component: TextInput,
  },
  equipment: {
    name: "อุปกรณ์ที่ต้องการยืม",
    component: Select,
    options: ["เลือกตัวเลือก", "Notebook", "External"],
  },
  number: {
    name: "จำนวน",
    component: NumberInput,
  },
  purpose: {
    name: "วัตถุประสงค์การใช้งาน",
    component: TextInput,
  },
  start_date_time: {
    name: "วันเวลา เริ่มใช้งาน",
    component: DateTimePicker,
  },
  end_date_time: {
    name: "วันเวลา สิ้นสุดใช้งาน",
    component: DateTimePicker,
  },
  location: {
    name: "สถานที่ใช้งาน",
    component: TextInput,
  },
};

const Checkcondition = (condition: boolean, ans: string): string | null => {
  return condition ? ans : null;
};

// For call get rows
// const fetchData = async () => await (await fetch(`${API}`)).json();
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
  const form = useForm({
    initialValues: init,

    validate: {
      employee_id: (value) =>
        Checkcondition(
          // `${value}`.length < 8 && `${value}`.length < 10,
          !/^\d{8}$/.test(`${value}`),
          "โปรดใส่รหัสพนักงานให้ถูกต้อง"
        ),
      full_name: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      position: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      department: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      tel: (value) =>
        Checkcondition(
          !/^\d{4,10}$/.test(`${value}`),
          "โปรดใส่รหัสพนักงานให้ถูกต้อง"
        ),
      equipment: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      number: (value) =>
        Checkcondition(value < 1, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      purpose: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      location: (value) =>
        Checkcondition(`${value}`.length < 3, "โปรดใส่รหัสพนักงานให้ถูกต้อง"),
      start_date_time: (value, values) => {
        const start = dayjs(value);
        const end = dayjs(values.end_date_time);
        return Checkcondition(
          !start.isBefore(end) || value == null,
          "โปรดใส่รหัสพนักงานให้ถูกต้อง"
        );
      },
      end_date_time: (value, values) => {
        const start = dayjs(values.start_date_time);
        const end = dayjs(value);
        return Checkcondition(
          !end.isAfter(start) || value == null,
          "โปรดใส่รหัสพนักงานให้ถูกต้อง"
        );
      },
    },
  });
  const AddRow = async (data: any) => {
    setLoading(true);
    dayjs.locale("th");
    const startDateTime = dayjs(data.start_date_time).add(543, "year");
    const endDateTime = dayjs(data.end_date_time).add(543, "year");
    const currentDate = dayjs().add(543, "year");

    const formattedStartDateTime = startDateTime.format(
      "D เดือน MMMM ปี YYYY เวลา HH:mm น."
    );
    const formattedEndDateTime = endDateTime.format(
      "D เดือน MMMM ปี YYYY เวลา HH:mm น."
    );
    const formattedCurrentDate = currentDate.format("D เดือน MMMM ปี YYYY");
    const currentTime = currentDate.format("HH:mm");

    const payload = {
      ...data,
      start_date_time: formattedStartDateTime,
      end_date_time: formattedEndDateTime,
      date_request: formattedCurrentDate,
      time_request: currentTime,
    };

    try {
      await fetch(`${API}`, {
        method: "POST",
        body: JSON.stringify(payload),
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
  const valid = useMemo(() => CheckObject(init, form.values), [form.values]);
  const [loading, setLoading] = useState(false);

  return (
    <Container className={`font-style`} fluid h={`100vh`} w={`100%`} bg="#ececc6" p={50}>
      <FormProvider h={`100%`} w={`100%`} bg="#ffffff">
        <Box component={GridCol} span={6}>
          <Center h={`100%`}>
            <Image radius="lg" src={"/logo.png"} w={"90%"} />
          </Center>
        </Box>
        <Box component={GridCol} span={6} h={`100%`} display={"flex"}>
          <Form onSubmit={form.onSubmit(AddRow)}>
            <Title className={`font-style`} size="h4">เพิ่มรายการที่ต้องการยืมอุปกรณ์ IT</Title>
            <Grid h={`80%`} py={20}>
              {renderInputList}
            </Grid>
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
