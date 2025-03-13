import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Space,
  DatePicker,
  Select,
  Spin,
  ConfigProvider,
} from "antd";
// import { ClaimRequest } from "../../types/ClaimRequest";
import { ProjectInfo } from "../../types/Project";
import { getAllProject } from "../../services/projectService";
import { getUsers } from "../../services/userAuth";
import { debounce } from "lodash";
import { createClaimRequest } from "../../services/claimService";
import { toast } from "react-toastify";

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
  totalNoOfHours: number;
  remark: string;
}

const ModalAddNewClaim: React.FC<ModalAddNewClaimProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();

  const [projects, setProjects] = useState<ProjectInfo[]>([]);

  const [approvals, setApprovals] = useState<
    { label: string; value: string }[]
  >([]);
  const [fetching, setFetching] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;

  const fetchProjects = async () => {
    try {
      const response = await getAllProject({
        searchCondition: {
          keyword: "",
          project_start_date: "",
          project_end_date: "",
          user_id: userId,
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      });
      setProjects(response.data.pageData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchUserList = async (search: string) => {
    if (!search) return;
    setFetching(true);
    const response = await getUsers(
      {
        keyword: search,
        role_code: "A003",
        user_id: userId,
      },
      { pageNum: 1, pageSize: 10 }
    );
    console.log(response.data.pageData);
    setApprovals(
      response.data.pageData.map((user: any) => ({
        label: `${user.user_name} | (${user.email})`,
        value: user._id,
      }))
    );
    setFetching(false);
  };

  const debounceFetcher = useMemo(() => debounce(fetchUserList, 300), []);

  const [claimRequestData, setClaimRequestData] =
    useState<ClaimRequestDataField>({
      project_id: "",
      approval_id: "",
      claim_name: "",
      claim_start_date: "",
      claim_end_date: "",
      totalNoOfHours: 0,
      remark: "",
    });

  const handleClaimRequestDataChange = (
    key: keyof ClaimRequestDataField,
    value: any
  ) => {
    setClaimRequestData((prevData) => ({
      ...prevData,
      [key]: value,
      ...(key === "claim_start_date" && { from: value.toISOString() }),
      ...(key === "claim_end_date" && { to: value.toISOString() }),
    }));
  };

  const onFinish = async () => {
    form.validateFields().then(async (values) => {
      const formData: ClaimRequestDataField = {
        ...claimRequestData,
        approval_id: values.approval_id.value,
        project_id: values.project_id,
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
          <span className="text-xl font-light">Create Claim Request</span>
        }
        okButtonProps={{ className: "!py-5 !rounded-xl" }}
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
              onChange={(value) =>
                handleClaimRequestDataChange("project_id", value)
              }
            >
              {projects &&
                projects.map((project, index) => (
                  <Select.Option key={index} value={project._id}>
                    {project.project_name}
                  </Select.Option>
                ))}
            </Select>
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
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={debounceFetcher}
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
                    if (!value || !startDate || value.isAfter(startDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End date must be after start date")
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
              name="totalNoOfHours"
              rules={[
                { required: true, message: "Please enter total working hours" },
              ]}
            >
              <Input
                type="number"
                value={claimRequestData.totalNoOfHours}
                className="!font-squada"
                onChange={(e) =>
                  handleClaimRequestDataChange(
                    "totalNoOfHours",
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
