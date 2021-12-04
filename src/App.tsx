import Form from "./components/form/form";
import { Input, Select, MoneyInput, PhoneInput } from "./components/form";
import Table, { ColumnData } from "./components/table/table";

function App() {
  return (
    <div>
      <Form
        defaultValues={formInitials}
        onSubmit={(val) => {
          console.log(val);
        }}
      >
        <Input name="applicantName" placeholder="Applicant Name" />
        <Select
          name="businessName"
          options={[
            {
              name: "Category 1",
              key: "cat1",
            },
            {
              name: "Category 2",
              key: "cat2",
            },
            {
              name: "All of Above",
              key: "all",
            },
          ]}
        />
        <PhoneInput name="phoneNumber" />
        <MoneyInput name="instagram" />
        <button type="submit">Submit</button>
      </Form>
      <Table
        style={{ marginLeft: "auto", marginRight: "auto", marginTop: "1.5rem" }}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}

interface TestDataFilters {
  applicantName: string;
  businessName: string;
  age: number | null;
  dateAdded: string;
  phoneNumber: string;
  instagram: string;
}

const formInitials: TestDataFilters = {
  applicantName: "",
  businessName: "",
  age: null,
  dateAdded: "",
  instagram: "",
  phoneNumber: "",
};

interface TestData {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  business: string;
  dateAdded: string;
  photoUrl?: string;
  phoneNumber: string;
  instagram?: string;
}

const rows: TestData[] = [
  {
    id: 0,
    firstName: "Gavin",
    lastName: "Noktes",
    age: 16,
    business: "Present",
    dateAdded: "11/24/2021",
    photoUrl:
      "https://media-exp1.licdn.com/dms/image/C4E03AQHckhuXlQLWAw/profile-displayphoto-shrink_200_200/0/1610455172470?e=1643241600&v=beta&t=kqzl6rbzrpwmbW9UuGPH7RdYLMB3ONiBMVe-o40hkBI",
    phoneNumber: "404-312-6808",
    instagram: "gavin.noktes",
  },
  {
    id: 1,
    firstName: "Ande",
    lastName: "Noktes",
    age: 44,
    business: "Ande & Co.",
    dateAdded: "11/26/2021",
    photoUrl:
      "https://miro.medium.com/focal/1200/900/39/44/1*Hx234hX-Hc4Ce_nILvG2Mw.jpeg",
    phoneNumber: "404-644-8969",
  },
  {
    id: 2,
    firstName: "Westley",
    lastName: "Moore",
    age: 51,
    business: "DoD",
    dateAdded: "11/27/2021",
    phoneNumber: "571-329-8303",
  },
  {
    id: 3,
    firstName: "Rowan",
    lastName: "Noktes",
    age: 16,
    business: "Home Makeovers Co.",
    dateAdded: "11/28/2021",
    phoneNumber: "470-494-5223",
    instagram: "ro.noktes",
  },
];

const columns: ColumnData<TestData>[] = [
  { name: "Id" },
  {
    name: "Applicant",
    render: (row) => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={
              row.photoUrl ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Profile Photo"
            height={50}
            width={50}
          />
          <div>
            <p>{`${row.firstName} ${row.lastName}`}</p>
            <p style={{ color: "gray" }}>{row.age}</p>
          </div>
        </div>
      );
    },
    sortFunc: (row) => {
      return `${row.firstName} ${row.lastName}`;
    },
  },
  { name: "Age" },
  {
    name: "Date Of Birth",
    render: (row) => {
      const curr = new Date();
      return new Date(curr.setFullYear(curr.getFullYear() - row.age))
        .toLocaleDateString()
        .slice(Math.max(curr.toLocaleDateString().length - 4, 1));
    },
    sortFunc: (row) => {
      const curr = new Date();
      return new Date(curr.setFullYear(curr.getFullYear() - row.age))
        .toLocaleDateString()
        .slice(Math.max(curr.toLocaleDateString().length - 4, 1));
    },
  },
  {
    name: "Business",
    render: (row) => {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>{row.business}</p> <p style={{ color: "gray" }}>{row.age}</p>
        </div>
      );
    },
  },
  {
    name: "Phone Number",
    render: (row) => {
      return (
        <a style={{ color: "red" }} href={`tel:${row.phoneNumber}`}>
          {row.phoneNumber}
        </a>
      );
    },
  },
  {
    name: "Instagram",
    render: (row) => {
      if (row.instagram) {
        return (
          <a href={`https://www.instagram.com/${row.instagram}/`}>
            @{row.instagram}
          </a>
        );
      }
      return <div>N/A</div>;
    },
  },
  {
    name: "Date Added",
  },
];

export default App;
