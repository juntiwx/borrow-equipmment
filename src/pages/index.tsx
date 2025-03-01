import { useEffect, useMemo, useState } from "react";
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
  Center,
  Title,
  GridCol,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { Athiti } from "next/font/google";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { InputPayload } from "../types";

// Google font
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

// ตั้งค่าตัวแปร Environment
const API = process.env.NEXT_PUBLIC_API_ENTPOINT;

/* ----------------------------------------------------- *
 *                        STYLES                         *
 * ----------------------------------------------------- */

// สร้าง FormProvider เพื่อกำหนด style ให้ Container หลักมี scroll เมื่อเนื้อหายาว
const FormProvider = styled(Grid)`
  padding: 30px 40px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    /* ลดขอบด้านข้างจาก 20px เหลือ 10px */
    padding: 20px 10px;
    max-height: none;
    box-shadow: none;
    border-radius: 8px;
  }

  .mantine-Grid-inner {
    height: 100%;
    @media (max-width: 768px) {
      display: block;
    }
  }

  /* บังคับคอลัมน์ให้เต็มพื้นที่เมื่อจอเล็ก */
  @media (max-width: 768px) {
    .mantine-Grid-col {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
`;

const FormWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * หมายเหตุ: ลบโค้ดที่ซ่อน option แรกออก เพื่อให้ placeholder แสดงเป็นตัวเลือกแรกได้ตามปกติ
 */
const CustomSelect = styled(NativeSelect)``;

/* ----------------------------------------------------- *
 *                    HELPER FUNCTIONS                   *
 * ----------------------------------------------------- */

/**
 * checkCondition - ใช้ตรวจสอบเงื่อนไขของการ validate
 * @param condition เงื่อนไข boolean หากเป็น true = เกิด error
 * @param errorMsg ข้อความที่จะแสดงเมื่อเกิด error
 * @returns string | null
 */
const checkCondition = (condition: boolean, errorMsg: string): string | null =>
  condition ? errorMsg : null;

/* ----------------------------------------------------- *
 *               INITIAL VALUES & VALIDATION             *
 * ----------------------------------------------------- */

// ค่าเริ่มต้นในฟอร์ม
const initialFormValues = {
  employee_id: "",
  full_name: "",
  position: "",
  department: "",
  tel: "",
  equipment: "",
  purpose: "",
  start_date_time: null as Date | null,
  end_date_time: null as Date | null,
  location: "",
  number: 0,
  computers: [] as { computer_name: string; asset_number: string }[],
};

type FormValuesType = typeof initialFormValues;

/**
 * เปรียบเทียบ object form values กับ initial values
 * เพื่อดูว่าเป็นค่าเริ่มต้น (ไม่มีการกรอก) ทั้งหมดหรือไม่
 */
const checkObjectIsInitial = (
  initObj: FormValuesType,
  compareObj: FormValuesType
): boolean => {
  return !Object.entries(initObj)
    .map(([key, val]) => compareObj[key as keyof FormValuesType] !== val)
    .includes(false);
};

/* ----------------------------------------------------- *
 *                 MAIN COMPONENT (PAGE)                 *
 * ----------------------------------------------------- */

function LoanRequestForm() {
  const [departmentOptions, setDepartmentOptions] = useState(["เลือกตัวเลือก"]);
  const [equipmentOptions, setEquipmentOptions] = useState(["เลือกตัวเลือก"]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลตัวเลือก department และ equipment จาก Google Sheets
  useEffect(() => {
    const sheetId = "1LK4Uz0gJC57zF2zvnDowkh1ZFPzi6sguKaPweZYxaqk";
    const sheetName = "select_option";
    const query = "select A, B";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}&tq=${encodeURIComponent(
      query
    )}`;

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        // ข้อมูลที่ได้จาก Google Sheets จะมี prefix และ suffix ต้องตัดออก
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const deptOptions: string[] = [];
        const equipOptions: string[] = [];

        // แถวแรกเป็น header (A, B) จึงเริ่มจาก .slice(1)
        jsonData.table.rows.slice(1).forEach((row: any) => {
          if (row.c) {
            const deptVal = row.c[0]?.v;
            const equipVal = row.c[1]?.v;
            if (deptVal) deptOptions.push(deptVal);
            if (equipVal) equipOptions.push(equipVal);
          }
        });

        setDepartmentOptions((prev) => [...prev, ...deptOptions]);
        setEquipmentOptions((prev) => [...prev, ...equipOptions]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // กำหนดรายละเอียด Input แต่ละฟิลด์ในฟอร์ม (type-safe มากขึ้น)
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
      component: CustomSelect,
      options: departmentOptions,
    },
    tel: {
      name: "Tel (เบอร์ติดต่อ) *",
      component: TextInput,
    },
    equipment: {
      name: "Equipment (อุปกรณ์ที่ต้องการยืม) *",
      component: CustomSelect,
      options: equipmentOptions,
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
    number: {
      name: "Unit (จำนวน) * (สูงสุด 5)",
      component: NumberInput,
      max: 5,
    },
  };

  // useForm สำหรับจัดการฟอร์มและการ validate
  const form = useForm<FormValuesType>({
    initialValues: initialFormValues,
    validate: {
      employee_id: (value) =>
        checkCondition(!/^\d{8}$/.test(`${value}`), "โปรดระบุรหัสพนักงาน 8 หลัก"),
      full_name: (value) =>
        checkCondition(value.trim().length < 3, "โปรดระบุชื่อ-สกุลให้ถูกต้อง"),
      position: (value) =>
        checkCondition(value.trim().length < 3, "โปรดระบุตำแหน่งให้ถูกต้อง"),
      department: (value) =>
        checkCondition(value.trim().length < 3, "โปรดระบุหน่วยงานให้ถูกต้อง"),
      tel: (value) =>
        checkCondition(!/^\d{4,10}$/.test(`${value}`), "โปรดระบุเบอร์โทร 4-10 หลัก"),
      equipment: (value) =>
        checkCondition(value.trim().length < 3, "โปรดระบุอุปกรณ์ให้ถูกต้อง"),
      number: (value) =>
        checkCondition(value < 1 || value > 5, "โปรดระบุจำนวน 1-5 เท่านั้น"),
      purpose: (value) =>
        checkCondition(value.trim().length < 3, "โปรดระบุเหตุผลในการยืมอย่างน้อย 3 ตัวอักษร"),
      location: (value) =>
        checkCondition(value.trim().length < 3, "โปรดระบุสถานที่ใช้งานอย่างน้อย 3 ตัวอักษร"),
      start_date_time: (value, values) => {
        const start = dayjs(value);
        const end = dayjs(values.end_date_time);
        return checkCondition(
          !start.isBefore(end) || !value,
          "โปรดระบุวันเวลาเริ่มต้นการยืมให้ถูกต้อง (ต้องน้อยกว่าวันสิ้นสุด)"
        );
      },
      end_date_time: (value, values) => {
        const start = dayjs(values.start_date_time);
        const end = dayjs(value);
        return checkCondition(
          !end.isAfter(start) || !value,
          "โปรดระบุวันเวลาสิ้นสุดการยืมให้ถูกต้อง (ต้องมากกว่าวันเริ่มต้น)"
        );
      },
      computers: (computerArray) => {
        if (Array.isArray(computerArray)) {
          for (const comp of computerArray) {
            if (
              comp.computer_name.trim().length < 1 ||
              comp.asset_number.trim().length < 1
            ) {
              return "โปรดระบุ Computer Name และ Asset Number ให้ครบถ้วน";
            }
          }
        }
        return null;
      },
    },
  });

  /* ----------------------------------------------------- *
   *     Handle dynamic fieldsสำหรับ computer detail       *
   * ----------------------------------------------------- */

  // เมื่อจำนวน(number) เปลี่ยน ให้ปรับจำนวนฟิลด์ "computers" โดยสูงสุด 5 ชุด
  useEffect(() => {
    const count = Math.min(form.values.number, 5); // สูงสุด 5
    const currentComputers = form.values.computers || [];
    let updatedComputers = [...currentComputers];

    if (updatedComputers.length < count) {
      // ถ้าจำนวนน้อยกว่าค่า number ปัจจุบัน ให้เติม object เปล่าเข้าไป
      for (let i = updatedComputers.length; i < count; i++) {
        updatedComputers.push({ computer_name: "", asset_number: "" });
      }
    } else if (updatedComputers.length > count) {
      // ถ้าจำนวนมากกว่า count ให้ตัดทิ้ง
      updatedComputers = updatedComputers.slice(0, count);
    }

    form.setFieldValue("computers", updatedComputers);
  }, [form.values.number]);

  /* ----------------------------------------------------- *
   *               SUBMIT & NOTIFICATION HANDLER           *
   * ----------------------------------------------------- */

  // ฟังก์ชันสำหรับดำเนินการเมื่อกดปุ่ม Submit
  const handleSubmit = async (values: FormValuesType) => {
    setLoading(true);

    // ตั้งค่า locale
    dayjs.locale("th");

    // เพิ่ม 543 ปีเพื่อให้แสดงค.ศ.เป็นพ.ศ.
    const startDateTime = dayjs(values.start_date_time).add(543, "year");
    const endDateTime = dayjs(values.end_date_time).add(543, "year");
    const currentDateTime = dayjs().add(543, "year");

    const formattedStartDate = startDateTime.format("D MMMM YYYY เวลา HH:mm น.");
    const formattedEndDate = endDateTime.format("D MMMM YYYY เวลา HH:mm น.");
    const formattedCurrentDate = currentDateTime.format("D MMMM YYYY");
    const formattedCurrentTime = currentDateTime.format("HH:mm");

    // เรียงลำดับตามความต้องการ (location -> number)
    const rowData = [
      values.employee_id,
      values.full_name,
      // หากมีการใช้ fields ที่ชื่อ template หรืออื่น ๆ เพิ่มเติม สามารถปรับได้
      values.template || "",
      values.position,
      values.department,
      values.tel,
      values.equipment,
      values.purpose,
      values.location,
      values.number,
      formattedStartDate,
      formattedEndDate,
      formattedCurrentDate,
      formattedCurrentTime,
    ];

    // เพิ่มข้อมูล computers (คู่ละ 2 ฟิลด์) สูงสุด 5 ชุด
    for (let i = 0; i < 5; i++) {
      if (values.computers[i]) {
        rowData.push(values.computers[i].computer_name || "");
        rowData.push(values.computers[i].asset_number || "");
      } else {
        rowData.push("");
        rowData.push("");
      }
    }

    try {
      await fetch(`${API}`, {
        method: "POST",
        body: JSON.stringify(rowData),
      });

      notifications.show({
        title: "แจ้งผลดำเนินการ",
        message: "ขอคำร้องสำเร็จ",
        color: "teal",
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "แจ้งผลดำเนินการ",
        message: "ขอคำร้องไม่สำเร็จ",
        color: "red",
      });
      setLoading(false);
    }
  };

  /* ----------------------------------------------------- *
   *               RENDERING FORM COMPONENTS               *
   * ----------------------------------------------------- */

  // render ฟิลด์ปกติ (employee_id, full_name, ...)
  const renderInputList = Object.entries(inputItems).map(([key, fieldConfig], idx) => {
    // กำหนด colSpan สำหรับ Grid
    const colSpan = key === "location" ? 8 : 4; // ขยาย "location" ให้ยาว 8 col
    const Component = fieldConfig.component; // เพื่อ render เป็น component ที่เหมาะสม

    return (
      <Grid.Col key={`${key}-${idx}`} span={colSpan} md={colSpan} sm={colSpan} xs={12}>
        <Component
          label={fieldConfig.name}
          data={fieldConfig.options}
          placeholder={fieldConfig.name} // คง placeholder ไว้ตาม fieldConfig.name
          {...form.getInputProps(key)}
          {...(fieldConfig.max ? { max: fieldConfig.max } : {})}
        />
      </Grid.Col>
    );
  });

  // render ฟิลด์ dynamic "computers"
  const renderComputerFields = form.values.computers.map((item, index) => (
    <Grid.Col key={`computer-${index}`} span={4} md={4} sm={6} xs={12}>
      <TextInput
        label={`Computer Name ${index + 1}`}
        placeholder="Computer Name"
        {...form.getInputProps(`computers.${index}.computer_name`)}
      />
      <TextInput
        label={`Asset Number ${index + 1}`}
        placeholder="Asset Number"
        {...form.getInputProps(`computers.${index}.asset_number`)}
        mt="xs"
      />
    </Grid.Col>
  ));

  // ตรวจว่าค่าทั้งหมดเป็นค่าเริ่มต้นหรือไม่ (หากเป็นค่าเริ่มต้น => disabled ปุ่ม)
  const isFormEmpty = useMemo(
    () => checkObjectIsInitial(initialFormValues, form.values),
    [form.values]
  );

  return (
    <Container
      className={athiti.className}
      fluid
      h="100%"
      w="100%"
      bg="#ececc6"
      p={20}
      style={{ minHeight: "100vh" }}
    >
      <FormProvider h="100%" w="100%">
        <Box component={GridCol} span={12}>
          <FormWrapper onSubmit={form.onSubmit(handleSubmit)}>
            {/* Title */}
            <Title className={athitiTitle.className} size="h3" align="center" mb="lg">
              เพิ่มรายการที่ต้องการยืมอุปกรณ์ IT
            </Title>

            {/* ฟิลด์หลัก */}
            <Grid py={20}>
              {renderInputList}
              {renderComputerFields}
            </Grid>

            {/* ลิงก์ดูรายการข้อมูลใน Google Sheets */}
            <Box mt="md" align="center">
              <a
                href="https://docs.google.com/spreadsheets/d/1LK4Uz0gJC57zF2zvnDowkh1ZFPzi6sguKaPweZYxaqk/edit"
                target="_blank"
                rel="noopener noreferrer"
              >
                รายการข้อมูล (ดูใน Google Sheets)
              </a>
            </Box>

            {/* ปุ่ม Submit */}
            <Box mt="lg" align="center">
              <Button
                type="submit"
                variant="gradient"
                loading={loading}
                // disabled={isFormEmpty || loading}
                gradient={{ from: "#3f9c85", to: "#1d566a", deg: 100 }}
              >
                Submit
              </Button>
            </Box>
          </FormWrapper>
        </Box>
      </FormProvider>
    </Container>
  );
}

// ตัวอย่างการใช้ getStaticProps ใน Next.js (กรณีที่ไม่ต้องการใช้ สามารถลบได้)
export const getStaticProps = async () => ({
  props: {},
});

export default LoanRequestForm;
