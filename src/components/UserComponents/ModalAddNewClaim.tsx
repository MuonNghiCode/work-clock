import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Space,
  DatePicker,
  Select,
  ConfigProvider,
} from "antd";
// import { ClaimRequest } from "../../types/ClaimRequest";
import { project_members } from "../../types/Project";
import { searchProject } from "../../services/projectService";
import { getUsers } from "../../services/userAuth";
import { debounce, values } from "lodash";
import { createClaimRequest } from "../../services/claimService";
import { toast } from "react-toastify";
import { useUserStore } from "../../config/zustand";

interface ModalAddNewClaimProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ClaimRequestDataField {
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  remark: string;
}
export interface ProjectSearch {
  created_at?: string;
  is_deleted: boolean;
  project_code: string; //
  project_department: string; //
  project_description: string; //
  project_end_date: string; //
  project_members: project_members[];
  project_name: string; //
  project_start_date: string; //
  project_status: string; //
  updated_at?: string;
  updated_by: string;
  _id: string;
}

const initialClaimRequestData: ClaimRequestDataField = {
  project_id: "",
  approval_id: "",
  claim_name: "",
  claim_start_date: "",
  claim_end_date: "",
  total_work_time: 0,
  remark: "",
};

const ModalAddNewClaim: React.FC<ModalAddNewClaimProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();

  const [approvals, setApprovals] = useState<{ label: string; value: string }[]>([]);
  const [projects, setProjects] = useState<{ label: string; value: string }[]>([]);
  const userData = useUserStore((state) => state.user);
  const userId = userData?.id || "";
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [claimRequestData, setClaimRequestData] = useState<ClaimRequestDataField>(initialClaimRequestData);

  useEffect(() => {
    const isUnchanged = JSON.stringify(claimRequestData) === JSON.stringify(initialClaimRequestData);
    setIsButtonDisabled(isUnchanged);
  }, [claimRequestData]);

  const fetchProjects = async (search: string) => {
    try {
      const response = await searchProject({
        searchCondition: {
          keyword: search,
          project_start_date: "",
          project_end_date: "",
          user_id: userId,
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 5,
          totalItems: 0,
          totalPages: 0,
        },
      });
      setProjects(
        response.data.pageData.map((project: ProjectSearch) => ({
          label: `${project.project_code} | ${project.project_name} `,
          value: project._id,
        }))
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserList = async (search: string) => {
    if (!search) return;
    const response = await getUsers(
      {
        keyword: search,
        role_code: "A003",
        user_id: userId,
      },
      { pageNum: 1, pageSize: 5 },
      true
    );
    setApprovals(
      response.data.pageData.map((user: any) => ({
        label: `${user.user_name} | (${user.email})`,
        value: user._id,
      }))
    );
  };
  const handleSearchApproval = useCallback(debounce((value: string) => {
    fetchUserList(value);
  }, 300), [values]);
  const handleSearchProjects = useCallback(debounce((value: string) => {
    fetchProjects(value);
  }, 300), [values]);
  // const debounceFetcher = useCallback(() => debounce(fetchUserList, 300), [approvals]);
  // const debounceFetchProject = useCallback(() => debounce(fetchProjects, 300), [projects]);


  const handleClaimRequestDataChange = (
    key: keyof ClaimRequestDataField,
    value: any
  ) => {
    setClaimRequestData((prevData) => ({
      ...prevData,
      [key]: value,
      ...(key === "claim_start_date" && value
        ? { from: value.toISOString() }
        : {}),
      ...(key === "claim_end_date" && value
        ? { to: value.toISOString() }
        : {}),
    }));
  };


  const onFinish = async () => {
    form.validateFields().then(async (values) => {
      const formData: ClaimRequestDataField = {
        ...claimRequestData,
        approval_id: values.approval_id.value,
        project_id: values.project_id.value,
      };
      const response = await createClaimRequest(formData);
      if (response.success) {
        toast.success("Claim request submitted successfully");
        form.resetFields();
        onClose();
      }
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Squada One",
        },
      }}
    >
      <Modal
        title={
          <span className="text-3xl text-gradient-color">
            Add New Claim Request
          </span>
        }
        open={isOpen}
        onOk={onFinish}
        cancelText={<span className="text-xl font-light">Cancel</span>}
        okText={
          <span className="text-xl font-light ">Create Claim Request</span>
        }
        okButtonProps={{
          className: `!py - 5!rounded - xl ${isButtonDisabled ? "!bg-gray-300" : ""
            }`,
          disabled: isButtonDisabled,
        }}
        cancelButtonProps={{ className: "!py-5 !rounded-xl" }}
        onCancel={onClose}
        className=" lg:!w-5/12 md:!w-full !font-squanda !w-full "
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="on"
          size="large"
          initialValues={{ claimRequestData }}
          className="font-squada"
        >
          <Form.Item
            label={<strong className="text-xl font-light">Claim Name</strong>}
            name="claim_name"
            rules={[{ required: true, message: "Please enter claim name" }]}
          >
            <Input
              value={claimRequestData.claim_name}
              onChange={(e) =>
                handleClaimRequestDataChange("claim_name", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            label={<strong className="text-xl font-light">Project Name</strong>}
            name={"project_id"}
            rules={[{ required: true, message: "Please select a project" }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder="Search and select project"
              notFoundContent={"project not found"}
              filterOption={false}
              onSearch={(value) => {
                handleSearchProjects(value);
              }}
              options={projects}
              style={{ width: "100%" }}
              onChange={(value) =>
                handleClaimRequestDataChange("project_id", value.value)
              }
            />
          </Form.Item>
          <Form.Item
            label={
              <strong className="text-xl font-light">Approval Name</strong>
            }
            name="approval_id"
            rules={[{ required: true, message: "Please select an approval" }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder="Search and select members"
              notFoundContent={"approval not found"}
              filterOption={false}
              onSearch={(value) => {
                handleSearchApproval(value);
              }}
              options={approvals}
              style={{ width: "100%" }}
              onChange={(value) =>
                handleClaimRequestDataChange("approval_id", value.value)
              }
            />
          </Form.Item>
          <Space
            direction="horizontal"
            size="large"
            className="!w-full justify-between !flex-wrap"
          >
            <Form.Item
              label={<strong className="text-xl font-light">From</strong>}
              name="claim_start_date"
              rules={[
                { required: true, message: "Please select a start date" },
              ]}
            >
              <DatePicker
                format={"DD-MM-YYYY"}
                onChange={(value) =>
                  handleClaimRequestDataChange("claim_start_date", value)
                }
              />
            </Form.Item>
            <Form.Item
              label={<strong className="text-xl font-light">To</strong>}
              name="claim_end_date"
              rules={[
                {
                  validator: (_, value) => {
                    const startDate = form.getFieldValue("claim_start_date");
                    if (!value || !startDate || !value.isBefore(startDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End date must be the same or after start date")
                    );
                  },
                },
              ]}
            >
              <DatePicker
                format={"DD-MM-YYYY"}
                onChange={(value) =>
                  handleClaimRequestDataChange("claim_end_date", value)
                }
              />
            </Form.Item>
            <Form.Item
              label={
                <strong className="text-xl font-light">
                  Total Working Hours
                </strong>
              }
              name="total_work_time"
              rules={[
                { required: true, message: "Please enter total working hours" },
              ]}
            >
              <Input
                type="number"
                value={claimRequestData.total_work_time}
                className="!font-squada"
                onChange={(e) =>
                  handleClaimRequestDataChange(
                    "total_work_time",
                    Number(e.target.value)
                  )
                }
              />
            </Form.Item>
          </Space>
          <Form.Item
            label={<strong className="text-xl font-light">Remarks</strong>}
            name="remark"
          >
            <Input.TextArea
              className="!font-squada"
              value={claimRequestData.remark}
              onChange={(e) =>
                handleClaimRequestDataChange("remark", e.target.value)
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalAddNewClaim;
