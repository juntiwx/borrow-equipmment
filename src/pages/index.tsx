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
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Athiti } from "next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const athiti = Athiti({
  weight: "400", // if single weight, otherwise you use array like [400, 500, 700],
  style: "normal", // if single style, otherwise you use array like ['normal', 'italic']
  subsets: ["latin"],
});

const athitiTitle = Athiti({
  weight: "500", // if single weight, otherwise you use array like [400, 500, 700],
  style: "normal", // if single style, otherwise you use array like ['normal', 'italic']
  subsets: ["latin"],
});

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
    options: [
      "เลือกตัวเลือก",
      "แผนกบริการวิชาการ",
      "แผนกสนับสนุนงานบริการ",
      "กลุ่มกลยุทธ์และพัฒนาวิชาการ",
      "กลุ่มงานอาคารอทิตยาทร",
      "กลุ่มบริการวิชาการ",
      "กลุ่มบัณฑิตศึกษา",
      "กลุ่มศิษย์เก่าสัมพันธ์และแนะแนวอาชีพ",
      "กลุ่มสาขาวิชาการจัดการการท่องเที่ยวและการบริการ",
      "กลุ่มสาขาวิชาจิตรกรรมและศิลปกรรม",
      "กลุ่มสาขาวิชาบริหารธุรกิจ",
      "กลุ่มสาขาวิชามนุษยศาสตร์และภาษาต่างประเทศ",
      "กลุ่มสาขาวิชาวิทยาศาสตร์",
      "กลุ่มสาขาวิชาสังคมศาสตร์",
      "คณะผู้บริหาร",
      "งานเทคโนโลยีการศึกษา",
      "งานเทคโนโลยีสารสนเทศ",
      "งานแผนและพัฒนาคุณภาพ",
      "งานการเงินและบัญชี",
      "งานการต่างประเทศ",
      "งานกิจการนักศึกษา",
      "งานทรัพยากรบุคคล",
      "งานบริหารกลาง",
      "งานบริหารการศึกษา",
      "งานปฏิบัติการและสิ่งแวดล้อม",
      "งานพัสดุ",
      "งานรับสมัครและทะเบียนนักศึกษา",
      "งานส่งเสริมและบริหารการวิจัย",
      "งานสื่อสารองค์กร",
      "งานห้องสมุด",
      "ฝ่ายการคลังและทรัพยากรบุคคล",
      "ฝ่ายการวางแผนกลยุทธ์และพัฒนาคุณภาพ",
      "ฝ่ายการศึกษา",
      "ฝ่ายกิจการนักศึกษา",
      "ฝ่ายวิเทศสัมพันธ์",
      "ฝ่ายวิจัยและการบริการวิชาการ",
      "ฝ่ายสำนักงานคณบดี",
      "ฝ่ายสิ่งแวดล้อมและการพัฒนาอย่างยั่งยืน",
      "ฝ่ายสื่อสารองค์กรและสารสนเทศ",
      "ศูนย์เตรียมความพร้อมภาษาและคณิตศาสตร์",
      "ศูนย์ปฏิบัติการโรงแรมศาลายาพาวิลเลียน",
      "สำนักงานคณบดี",
      "หน่วยเลขานุการ",
      "หน่วยแนะแนวอาชีพ",
      "หน่วยแผนติดตามและประเมินผล",
      "หน่วยแลกเปลี่ยนนักศึกษา",
      "หน่วยกลยุทธ์วิชาการ",
      "หน่วยการเงิน",
      "หน่วยการจัดการทรัพยากรบุคคล",
      "หน่วยการตลาด",
      "หน่วยคลังพัสดุ",
      "หน่วยจัดหาพัสดุ",
      "หน่วยซ่อมบำรุง",
      "หน่วยทะเบียนและประเมินผล",
      "หน่วยที่ปรึกษาทางวิชาการ",
      "หน่วยธุรการ",
      "หน่วยบริการเทคโนโลยีการศึกษา",
      "หน่วยบริการและปฏิบัติการคอมพิวเตอร์",
      "หน่วยบริการและสวัสดิการนักศึกษา",
      "หน่วยบริการห้องสมุด (อาคารอทิตยาทร)",
      "หน่วยบริการห้องสมุด 1  (MUIC อาคาร 1)",
      "หน่วยบริหารงบประมาณ",
      "หน่วยบริหารจัดการทรัพยากรสารสนเทศห้องสมุด ",
      "หน่วยบริหารจัดการอาคาร",
      "หน่วยบริหารจัดการอาคารและความปลอดภัย",
      "หน่วยบริหารหลักสูตร",
      "หน่วยบัญชี",
      "หน่วยบ้านพักนักศึกษา",
      "หน่วยประเมินผลการวิจัย",
      "หน่วยฝึกอบรม",
      "หน่วยพัฒนาเครือข่ายโครงการที่ปรึกษา",
      "หน่วยพัฒนาและผลิตสื่อ",
      "หน่วยพัฒนาโครงการเพื่อสร้างความร่วมมือ",
      "หน่วยพัฒนาการจัดอันดับมหาวิทยาลัย",
      "หน่วยพัฒนาความก้าวหน้าทางวิชาชีพ",
      "หน่วยพัฒนาคุณภาพ",
      "หน่วยพัฒนาทรัพยากรบุคคล",
      "หน่วยพัฒนานักศึกษา",
      "หน่วยพันธกิจสัมพันธ์เพื่อสังคม",
      "หน่วยระบบคอมพิวเตอร์เครื่องแม่ข่าย",
      "หน่วยรับสมัครและจัดสอบ",
      "หน่วยวิเคราะห์และพัฒนาระบบ",
      "หน่วยวิเทศสัมพันธ์และเครือข่ายต่างประเทศ",
      "หน่วยวิศวกรรมและระบบอาคาร",
      "หน่วยวิศวกรรมและสาธารณูปโภค",
      "หน่วยศิษย์เก่าสัมพันธ์",
      "หน่วยส่งเสริมการวิจัย",
      "หน่วยสนับสนุนกลุ่มสาขาวิชา",
      "หน่วยสนับสนุนบริการบัณฑิตศึกษา",
      "หน่วยสนับสนุนวิชาการบัณฑิตศึกษา",
      "หน่วยสนับสนุนอาจารย์",
      "หน่วยสวัสดิการและสิทธิประโยชน์",
      "หน่วยสิ่งแวดล้อมและการบริการทั่วไป",
      "หน่วยสื่อทางการศึกษา",
      "หน่วยสื่อสารองค์กร",
      "หน่วยห้องปฏิบัติการวิทยาศาสตร์",
    ],
  },
  tel: {
    name: "Tel (เบอร์ติดต่อ) *",
    component: TextInput,
  },
  equipment: {
    name: "Equipment (อุปกรณ์ที่ต้องการยืม) *",
    component: Select,
    options: ["เลือกตัวเลือก", "Notebook", "External"],
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
  const supabaseClient = useSupabaseClient();
  useEffect(() => {
    (async () => {
      const { data } = await supabaseClient.from("borrow").select("*");
      console.log(data);
    })();
  }, []);

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
      await supabaseClient.from("borrow").insert(payload);

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
    <>
      <title>แบบฟอร์มกรอกข้อมูลขอใช้งานอุปกรณ์ IT</title>
      <Container
        className={athiti.className}
        fluid
        h={`100vh`}
        w={`100%`}
        bg="#ececc6"
        p={50}
      >
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
    </>
  );
}

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default ContactUs;
