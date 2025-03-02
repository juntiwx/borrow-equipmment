import { useEffect, useMemo, useState } from "react";
import { useForm, FormErrors } from "@mantine/form";
import { NumberInput, TextInput, NativeSelect } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
<<<<<<< HEAD
import { InputPayload } from "../types";
import dayjs from "dayjs";
import "dayjs/locale/th";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Athiti } from "next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Head from "next/head";
=======
import { notifications } from "@mantine/notifications";
import { Athiti } from "next/font/google";
import dayjs from "dayjs";
import "dayjs/locale/th";
>>>>>>> function_asset_numbet

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

<<<<<<< HEAD
const FormProvider = styled(Grid)`
  padding: 30px 40px;
  border-radius: 16px;
  .mantine-Grid-inner {
    height: 100%;
  }
`;
=======
const API = process.env.NEXT_PUBLIC_API_ENTPOINT;
>>>>>>> function_asset_numbet

// ===========================================
//  ประกาศโครงสร้างข้อมูลในฟอร์ม
// ===========================================
interface ComputerItem {
  computer_name: string;
  asset_number: string;
}

interface FormValues {
  employee_id: string;
  full_name: string;
  position: string;
  department: string;
  tel: string;
  equipment: string;
  purpose: string;
  start_date_time: Date | null;
  end_date_time: Date | null;
  location: string;
  number: number;
  computers: ComputerItem[];
}

<<<<<<< HEAD
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
=======
// ===========================================
//  ค่าเริ่มต้นในฟอร์ม
// ===========================================
const initialFormValues: FormValues = {
>>>>>>> function_asset_numbet
  employee_id: "",
  full_name: "",
  position: "",
  department: "",
  tel: "",
  equipment: "",
  purpose: "",
  start_date_time: null,
  end_date_time: null,
  location: "",
  number: 0,
  computers: [],
};

<<<<<<< HEAD
function ContactUs() {
  const supabaseClient = useSupabaseClient();

  const form = useForm({
    initialValues: init,
=======
// ===========================================
//  ฟังก์ชันตรวจสอบว่า form เปลี่ยนจากค่าเริ่มต้นหรือยัง
// ===========================================
const isFormChanged = (initial: FormValues, current: FormValues): boolean => {
  return JSON.stringify(initial) !== JSON.stringify(current);
};
>>>>>>> function_asset_numbet

export default function LoanRequestForm() {
  const [departmentOptions, setDepartmentOptions] = useState(["เลือกตัวเลือก"]);
  const [equipmentOptions, setEquipmentOptions] = useState(["เลือกตัวเลือก"]);
  const [loading, setLoading] = useState(false);

  // =========================================
  //  ดึงข้อมูลตัวเลือกจาก Google Sheets
  // =========================================
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

        // ข้าม row แรก เพราะเป็น header
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

  // =========================================
  //  useForm + validate (custom function)
  // =========================================
  const form = useForm<FormValues>({
    initialValues: initialFormValues,
    validate: (values) => {
      const errors: FormErrors<FormValues> = {};

      // -------------------------------------
      // Validate: employee_id
      // -------------------------------------
      if (!/^\d{8}$/.test(values.employee_id)) {
        errors.employee_id = "โปรดระบุรหัสพนักงาน 8 หลัก";
      }

      // -------------------------------------
      // Validate: full_name
      // -------------------------------------
      if (values.full_name.trim().length < 3) {
        errors.full_name = "โปรดระบุชื่อ-สกุลให้ถูกต้อง (อย่างน้อย 3 ตัวอักษร)";
      }

      // -------------------------------------
      // Validate: position
      // -------------------------------------
      if (values.position.trim().length < 3) {
        errors.position = "โปรดระบุตำแหน่งให้ถูกต้อง (อย่างน้อย 3 ตัวอักษร)";
      }

      // -------------------------------------
      // Validate: department
      // -------------------------------------
      if (values.department.trim().length < 3) {
        errors.department = "โปรดระบุหน่วยงานให้ถูกต้อง";
      }

      // -------------------------------------
      // Validate: tel (4-10 หลักตัวเลข)
      // -------------------------------------
      if (!/^\d{4,10}$/.test(values.tel)) {
        errors.tel = "โปรดระบุเบอร์โทร 4-10 หลัก";
      }

      // -------------------------------------
      // Validate: equipment
      // -------------------------------------
      if (values.equipment.trim().length < 3) {
        errors.equipment = "โปรดระบุอุปกรณ์ให้ถูกต้อง";
      }

      // -------------------------------------
      // Validate: number (1-5)
      // -------------------------------------
      if (values.number < 1 || values.number > 5) {
        errors.number = "โปรดระบุจำนวน 1-5 เท่านั้น";
      }

      // -------------------------------------
      // Validate: purpose
      // -------------------------------------
      if (values.purpose.trim().length < 3) {
        errors.purpose = "โปรดระบุเหตุผลในการยืมอย่างน้อย 3 ตัวอักษร";
      }

      // -------------------------------------
      // Validate: location
      // -------------------------------------
      if (values.location.trim().length < 3) {
        errors.location = "โปรดระบุสถานที่ใช้งานอย่างน้อย 3 ตัวอักษร";
      }

      // -------------------------------------
      // Validate: start_date_time < end_date_time
      // -------------------------------------
      if (!values.start_date_time) {
        errors.start_date_time = "โปรดระบุวันเวลาเริ่มใช้งาน";
      }
      if (!values.end_date_time) {
        errors.end_date_time = "โปรดระบุวันเวลาสิ้นสุดการใช้งาน";
      }
      if (values.start_date_time && values.end_date_time) {
        const start = dayjs(values.start_date_time);
        const end = dayjs(values.end_date_time);

        if (!start.isBefore(end)) {
          errors.start_date_time =
            "โปรดระบุวันเวลาเริ่มต้นการยืมให้ถูกต้อง (ต้องน้อยกว่าวันสิ้นสุด)";
        }
      }

      // -------------------------------------
      // Validate: computers (dynamic array)
      // -------------------------------------
      if (values.computers && values.computers.length > 0) {
        const computersErrors = values.computers.map((comp, index) => {
          const itemErrors: { computer_name?: string; asset_number?: string } = {};

          if (!comp.computer_name.trim()) {
            itemErrors.computer_name = "โปรดระบุ Computer Name ให้ครบถ้วน";
          }

          if (!comp.asset_number.trim()) {
            itemErrors.asset_number = "โปรดระบุ Asset Number ให้ครบถ้วน";
          } else if (!/^\d+$/.test(comp.asset_number)) {
            itemErrors.asset_number = "Asset Number ต้องเป็นตัวเลขเท่านั้น";
          }

          return Object.keys(itemErrors).length > 0 ? itemErrors : null;
        });

        if (computersErrors.some((item) => item !== null)) {
          errors.computers = computersErrors as any;
        }
      }

      return errors;
    },
  });

  // =========================================
  //  Effect: สร้างฟิลด์ computers ตาม number
  // =========================================
  useEffect(() => {
    const count = Math.min(form.values.number, 5);
    let updatedComputers = [...(form.values.computers || [])];

    if (updatedComputers.length < count) {
      for (let i = updatedComputers.length; i < count; i++) {
        updatedComputers.push({ computer_name: "", asset_number: "" });
      }
    } else if (updatedComputers.length > count) {
      updatedComputers = updatedComputers.slice(0, count);
    }
    form.setFieldValue("computers", updatedComputers);
  }, [form.values.number]);

  // =========================================
  //  Handle Submit
  // =========================================
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    dayjs.locale("th");

    // ปรับปีให้เป็น พ.ศ. เฉพาะส่วนที่แสดงผล
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

    // เพิ่มข้อมูลคอมพิวเตอร์
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
<<<<<<< HEAD
      await supabaseClient.from("borrow").insert(payload);
=======
      await fetch(`${API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rowData),
      });
>>>>>>> function_asset_numbet

      notifications.show({
        title: "แจ้งผลดำเนินการ",
        message: "ขอคำร้องสำเร็จ",
        color: "teal",
      });
<<<<<<< HEAD

      form.reset();
      setLoading(false);
=======
      form.reset();
>>>>>>> function_asset_numbet
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "แจ้งผลดำเนินการ",
        message: "ขอคำร้องไม่สำเร็จ",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  //  เช็คว่าฟอร์มเปลี่ยนแปลงหรือยัง
  // =========================================
  const hasChanged = useMemo(
    () => isFormChanged(initialFormValues, form.values),
    [form.values]
  );

  // =========================================
  //  ส่วนแสดงผล Input หลัก
  // =========================================
  const renderMainFields = (
    <>
      {/* Employee ID */}
      <div className="col-span-12 md:col-span-4">
        <TextInput
          label="Employee ID (รหัสพนักงาน) *"
          placeholder="Employee ID"
          {...form.getInputProps("employee_id")}
          error={form.errors.employee_id}
        />
      </div>

      {/* Full name */}
      <div className="col-span-12 md:col-span-8">
        <TextInput
          label="Full name (ชื่อ สกุล) *"
          placeholder="Full name"
          {...form.getInputProps("full_name")}
          error={form.errors.full_name}
        />
      </div>

      {/* Position */}
      <div className="col-span-12 md:col-span-4">
        <TextInput
          label="Position (ตำแหน่ง) *"
          placeholder="Position"
          {...form.getInputProps("position")}
          error={form.errors.position}
        />
      </div>

      {/* Department */}
      <div className="col-span-12 md:col-span-4">
        <NativeSelect
          label="Section (หน่วยงาน) *"
          data={departmentOptions}
          placeholder="เลือกตัวเลือก"
          {...form.getInputProps("department")}
          error={form.errors.department}
        />
      </div>

      {/* Tel */}
      <div className="col-span-12 md:col-span-4">
        <TextInput
          label="Tel (เบอร์ติดต่อ) *"
          placeholder="Tel"
          {...form.getInputProps("tel")}
          error={form.errors.tel}
        />
      </div>

      {/* 
        ปรับ 3 ฟิลด์ Equipment, Unit, Purpose ให้อยู่ “แถวเดียวกัน” 
        โดยรวมกันให้ได้ 12 columns
      */}

      {/* Equipment => col-span-4 */}
      <div className="col-span-12 md:col-span-3">
        <NativeSelect
          label="Equipment (อุปกรณ์) *"
          data={equipmentOptions}
          placeholder="เลือกตัวเลือก"
          {...form.getInputProps("equipment")}
          error={form.errors.equipment}
        />
      </div>

      {/* Unit => col-span-2 */}
      <div className="col-span-12 md:col-span-3">
        <NumberInput
          label={
            <>
              Unit (จำนวน) *{" "}
              <span className="text-red-600">(สูงสุด 5)</span>
            </>
          }
          placeholder="จำนวน"
          max={5}
          {...form.getInputProps("number")}
          error={form.errors.number}
        />
      </div>

      {/* Purpose => col-span-6 */}
      <div className="col-span-12 md:col-span-6">
        <TextInput
          label="Purpose (วัตถุประสงค์การใช้งาน) *"
          placeholder="Purpose"
          {...form.getInputProps("purpose")}
          error={form.errors.purpose}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <DateTimePicker
          label="Date time start (วันเวลา เริ่มใช้งาน) *"
          {...form.getInputProps("start_date_time")}
          valueFormat="DD/MM/YYYY HH:mm"
          error={form.errors.start_date_time}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <DateTimePicker
          label="Date time end (วันเวลา สิ้นสุดใช้งาน) *"
          {...form.getInputProps("end_date_time")}
          valueFormat="DD/MM/YYYY HH:mm"
          error={form.errors.end_date_time}
        />
      </div>

      <div className="col-span-12">
        <TextInput
          label="Location (สถานที่ใช้งาน) *"
          placeholder="Location"
          {...form.getInputProps("location")}
          error={form.errors.location}
        />
      </div>
    </>
  );

  // =========================================
  //  ส่วนแสดงผลฟิลด์ computers (dynamic)
  // =========================================
  const renderComputers = form.values.computers.map((item, index) => (
    <div key={`computer-${index}`} className="col-span-12 bg-gray-50 p-4 rounded-md">
      <div className="font-semibold mb-2">รายการคอมพิวเตอร์ที่ #{index + 1} <i className="text-red-500">ไม่มีเลขครุภัณฑ์ ใส่ 0000</i></div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <TextInput
            label="Computer Name (ชื่ออุปกรณ์)"
            placeholder="Dell latitude 3400"
            {...form.getInputProps(`computers.${index}.computer_name`)}
            error={form.errors.computers?.[index]?.computer_name}
          />
        </div>
        <div className="flex-1">
          <TextInput
            label="Asset Number (เลขครุภัณฑ์)"
            placeholder="41000008765"
            {...form.getInputProps(`computers.${index}.asset_number`)}
            error={form.errors.computers?.[index]?.asset_number}
          />
        </div>
      </div>
    </div>
  ));

  return (
<<<<<<< HEAD
    <>
      <Head>
        <title>แบบฟอร์มกรอกข้อมูลขอใช้งานอุปกรณ์ IT</title>
      </Head>
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
              <Link href="/borrow-list">รายการข้อมูล โปรด Click !!</Link>
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

export default ContactUs;
=======
    <div className={`min-h-screen bg-[#ececc6] p-10 ${athiti.className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-md md:rounded-lg shadow-none md:shadow-lg overflow-y-auto md:max-h-[90vh] p-5 md:py-8 md:px-10">
          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="w-full flex flex-col items-center"
          >
            <h3
              className={`text-2xl font-semibold text-center mb-6 ${athitiTitle.className}`}
            >
              เพิ่มรายการที่ต้องการยืมอุปกรณ์ IT
            </h3>

            <div className="grid grid-cols-12 gap-4 py-5 w-full">
              {renderMainFields}
              {form.values.number > 0 && renderComputers}
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
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  !hasChanged ? "hidden" : ""
                } ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}
                disabled={!hasChanged || loading}
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
>>>>>>> function_asset_numbet
