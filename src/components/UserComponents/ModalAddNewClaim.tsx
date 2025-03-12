import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Space, DatePicker, Select, Spin } from "antd";
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
    <Modal
      title="Add New Claim Request"
      open={isOpen}
      onOk={onFinish}
      okText="Submit Claim Request"
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
      >
        <Form.Item label={<strong>Project Name</strong>} name={"project_id"}>
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
        <Form.Item label={<strong>Approval Name</strong>} name="approval_id">
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
          <Form.Item label="From" name="claim_start_date">
            <DatePicker
              showTime
              format={"DD-MM-YYYY - HH:mm"}
              onChange={(value) =>
                handleClaimRequestDataChange("claim_start_date", value)
              }
            />
          </Form.Item>
          <Form.Item label="To" name="claim_end_date">
            <DatePicker
              showTime
              format={"DD-MM-YYYY - HH:mm"}
              onChange={(value) =>
                handleClaimRequestDataChange("claim_end_date", value)
              }
            />
          </Form.Item>
          <Form.Item
            label={<strong>Total Working Hours</strong>}
            name="totalNoOfHours"
          >
            <Input
              type="number"
              value={claimRequestData.totalNoOfHours}
              onChange={(e) =>
                handleClaimRequestDataChange(
                  "totalNoOfHours",
                  Number(e.target.value)
                )
              }
            />
          </Form.Item>
        </Space>
        <Form.Item label={<strong>Remarks</strong>} name="remark">
          <Input.TextArea
            value={claimRequestData.remark}
            onChange={(e) =>
              handleClaimRequestDataChange("remark", e.target.value)
            }
          />
        </Form.Item>
        <Form.Item label={<strong>Claim Name</strong>} name="claim_name">
          <Input
            value={claimRequestData.claim_name}
            onChange={(e) =>
              handleClaimRequestDataChange("claim_name", e.target.value)
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddNewClaim;
