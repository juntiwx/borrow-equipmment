import { useEffect, useMemo, useState } from "react";
import { useForm } from "@mantine/form";
import { NumberInput, TextInput, Button, NativeSelect } from "@mantine/core";
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

const API = process.env.NEXT_PUBLIC_API_ENTPOINT;

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
 */
const checkObjectIsInitial = (
  initObj: FormValuesType,
  compareObj: FormValuesType
): boolean => {
  return !Object.entries(initObj)
    .map(([key, val]) => compareObj[key as keyof FormValuesType] !== val)
    .includes(false);
};

/**
 * ตรวจสอบเงื่อนไข validate
 */
const checkCondition = (condition: boolean, errorMsg: string): string | null =>
  condition ? errorMsg : null;

function LoanRequestForm() {
  const [departmentOptions, setDepartmentOptions] = useState(["เลือกตัวเลือก"]);
  const [equipmentOptions, setEquipmentOptions] = useState(["เลือกตัวเลือก"]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลตัวเลือกจาก Google Sheets
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
        // ตัด prefix/suffix ที่ไม่จำเป็นออก
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const deptOptions: string[] = [];
        const equipOptions: string[] = [];

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

  // กำหนดรายละเอียด input แต่ละ field
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
      component: NativeSelect,
      options: departmentOptions,
    },
    tel: {
      name: "Tel (เบอร์ติดต่อ) *",
      component: TextInput,
    },
    equipment: {
      name: "Equipment (อุปกรณ์ที่ต้องการยืม) *",
      component: NativeSelect,
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

  // ใช้งาน useForm สำหรับจัดการฟอร์มและ validate
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

  // เมื่อค่าของ number เปลี่ยน ให้ปรับจำนวนฟิลด์สำหรับรายละเอียด computer
  useEffect(() => {
    const count = Math.min(form.values.number, 5);
    const currentComputers = form.values.computers || [];
    let updatedComputers = [...currentComputers];

    if (updatedComputers.length < count) {
      for (let i = updatedComputers.length; i < count; i++) {
        updatedComputers.push({ computer_name: "", asset_number: "" });
      }
    } else if (updatedComputers.length > count) {
      updatedComputers = updatedComputers.slice(0, count);
    }

    form.setFieldValue("computers", updatedComputers);
  }, [form.values.number]);

  // ฟังก์ชันสำหรับ handle submit
  const handleSubmit = async (values: FormValuesType) => {
    setLoading(true);
    dayjs.locale("th");

    // ปรับปีให้เป็น พ.ศ.
    const startDateTime = dayjs(values.start_date_time).add(543, "year");
    const endDateTime = dayjs(values.end_date_time).add(543, "year");
    const currentDateTime = dayjs().add(543, "year");

    const formattedStartDate = startDateTime.format("D MMMM YYYY เวลา HH:mm น.");
    const formattedEndDate = endDateTime.format("D MMMM YYYY เวลา HH:mm น.");
    const formattedCurrentDate = currentDateTime.format("D MMMM YYYY");
    const formattedCurrentTime = currentDateTime.format("HH:mm");

    const rowData = [
      values.employee_id,
      values.full_name,
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

    // เพิ่มข้อมูล computer (สูงสุด 5 ชุด)
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

  // render ฟิลด์หลัก (input ต่าง ๆ)
  const renderInputList = Object.entries(inputItems).map(([key, fieldConfig], idx) => {
    const colSpanClass = key === "location" ? "md:col-span-8" : "md:col-span-4";
    const Component = fieldConfig.component;
    return (
      <div key={`${key}-${idx}`} className={`col-span-12 ${colSpanClass}`}>
        <Component
          label={fieldConfig.name}
          data={fieldConfig.options}
          placeholder={fieldConfig.name}
          {...form.getInputProps(key)}
          {...(fieldConfig.max ? { max: fieldConfig.max } : {})}
          className="w-full"
        />
      </div>
    );
  });

  // ส่วน render ฟิลด์สำหรับรายละเอียด computer (dynamic fields)
  // เดิม: 
  // const renderComputerFields = form.values.computers.map((item, index) => (
  //   <div key={`computer-${index}`} className="col-span-12 sm:col-span-6 md:col-span-4">
  //     <TextInput
  //       label={`Computer Name ${index + 1}`}
  //       placeholder="Computer Name"
  //       {...form.getInputProps(`computers.${index}.computer_name`)}
  //       className="w-full"
  //     />
  //     <TextInput
  //       label={`Asset Number ${index + 1}`}
  //       placeholder="Asset Number"
  //       {...form.getInputProps(`computers.${index}.asset_number`)}
  //       className="w-full mt-2"
  //     />
  //   </div>
  // ));

  // แก้เป็นการจัดให้อยู่คู่กันในแนวนอน
  const renderComputerFields = form.values.computers.map((item, index) => (
    <div key={`computer-${index}`} className="col-span-12">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <TextInput
            label={`Computer Name ${index + 1}`}
            placeholder="Computer Name"
            {...form.getInputProps(`computers.${index}.computer_name`)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <TextInput
            label={`Asset Number ${index + 1}`}
            placeholder="Asset Number"
            {...form.getInputProps(`computers.${index}.asset_number`)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  ));


  const isFormEmpty = useMemo(
    () => checkObjectIsInitial(initialFormValues, form.values),
    [form.values]
  );

  return (
    <div className={`min-h-screen bg-[#ececc6] p-10 ${athiti.className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-md md:rounded-lg shadow-none md:shadow-lg overflow-y-auto md:max-h-[90vh] p-5 md:py-8 md:px-10">
          <form onSubmit={form.onSubmit(handleSubmit)} className="w-full flex flex-col items-center">
            <h3 className={`text-2xl font-semibold text-center mb-6 ${athitiTitle.className}`}>
              เพิ่มรายการที่ต้องการยืมอุปกรณ์ IT
            </h3>
            <div className="grid grid-cols-12 gap-4 py-5 w-full">
              {renderInputList}
              {renderComputerFields}
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://docs.google.com/spreadsheets/d/1LK4Uz0gJC57zF2zvnDowkh1ZFPzi6sguKaPweZYxaqk/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                รายการข้อมูล (ดูใน Google Sheets)
              </a>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isFormEmpty || loading}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-blue-700 hover:opacity-90"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => ({
  props: {},
});

export default LoanRequestForm;
