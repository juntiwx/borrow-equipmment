import {
  MantineComponent,
  TextInputProps,
  __InputStylesNames,
} from "@mantine/core";

type InputType = {
  name: string;
  component: any;
  options?: string[];
};

export type ItemListType = {
  employee_id: string;
  full_name: string;
  position: string;
  department: string;
  tel: number;
  equipment: string;
  number: number;
  purpose: string;
  location: string;
  start_date_time: string;
  end_date_time: string;
};

export type InputPayload = {
  [k in keyof ItemListType]: InputType;
};
