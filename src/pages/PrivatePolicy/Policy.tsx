import React from "react";

interface PolicyProps {
  refs: {
    dataCollectionRef: React.RefObject<HTMLDivElement>;
    purposeRef: React.RefObject<HTMLDivElement>;
    dataUsageRef: React.RefObject<HTMLDivElement>;
    dataSharingRef: React.RefObject<HTMLDivElement>;
    dataSecurityRef: React.RefObject<HTMLDivElement>;
    userRightsRef: React.RefObject<HTMLDivElement>;
    contactUsRef: React.RefObject<HTMLDivElement>;
    dataRetentionRef: React.RefObject<HTMLDivElement>;
    cookiesPolicyRef: React.RefObject<HTMLDivElement>;
  };
}

const Policy: React.FC<PolicyProps> = ({ refs }) => {
  const {
    dataCollectionRef,
    purposeRef,
    dataUsageRef,
    dataSharingRef,
    dataSecurityRef,
    userRightsRef,
    contactUsRef,
    dataRetentionRef,
    cookiesPolicyRef,
  } = refs;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-l from-[#ffd6a5] to-[#ff914d] text-white rounded-lg p-6 mb-4 flex items-center">
        <div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm">Last updated: March 13, 2025</p>
        </div>
      </div>

      <div className="p-6 bg-white shadow-lg rounded-lg text-gray-800">
        <div ref={dataCollectionRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Data Collection
          </h2>
          <p>
            We collect personal data necessary for processing overtime requests,
            including employee names, contact information, and work schedules.
          </p>
          <p>
            Additionally, we may collect data on employee performance and
            attendance to improve our services and ensure compliance with
            company policies.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Types of Data Collected
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Personal Identification Information</li>
              <li>Contact Details</li>
              <li>Employment Details</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Methods of Collection
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Directly from employees</li>
              <li>Through automated systems</li>
              <li>Via third-party services</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={purposeRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Purpose of Data Collection
          </h2>
          <p>
            The data collected is used to manage and approve overtime requests,
            ensure accurate payroll processing, and maintain compliance with
            labor regulations.
          </p>
          <p>
            We also use this data to analyze workforce trends and optimize
            resource allocation across departments.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Specific Purposes
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Payroll Management</li>
              <li>Regulatory Compliance</li>
              <li>Performance Analysis</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Benefits of Data Collection
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Improved decision-making</li>
              <li>Enhanced employee satisfaction</li>
              <li>Streamlined operations</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={dataUsageRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Data Usage
          </h2>
          <p>
            Personal data is used exclusively for internal management purposes,
            including:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Processing and approving overtime requests.</li>
            <li>Communicating with employees regarding their requests.</li>
            <li>Generating reports for management review.</li>
            <li>
              Improving employee engagement and satisfaction through feedback
              analysis.
            </li>
          </ul>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Internal Use Only
            </h3>
            <p>
              Data is strictly used within the organization to enhance
              operational efficiency and employee satisfaction.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Data Processing Activities
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Data analysis and reporting</li>
              <li>Employee performance tracking</li>
              <li>Resource allocation planning</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={dataSharingRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Data Sharing
          </h2>
          <p>
            We do not share personal data with third parties, except as required
            by law or with service providers who assist in system maintenance
            and support.
          </p>
          <p>
            In such cases, we ensure that these parties adhere to strict data
            protection standards and confidentiality agreements.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Third-Party Agreements
            </h3>
            <p>
              All third-party service providers are bound by confidentiality
              agreements to protect your data.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Conditions for Sharing
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Legal obligations</li>
              <li>Service provider agreements</li>
              <li>Employee consent</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={dataSecurityRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Data Security
          </h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect personal data against unauthorized access, alteration,
            disclosure, or destruction.
          </p>
          <p>
            Regular security audits and employee training sessions are conducted
            to maintain high security standards.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Security Measures
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Encryption of sensitive data</li>
              <li>Access control mechanisms</li>
              <li>Regular security audits</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Employee Training
            </h3>
            <p>
              We conduct regular training sessions to ensure employees are aware
              of data security practices and protocols.
            </p>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={dataRetentionRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Data Retention
          </h2>
          <p>
            We retain personal data only as long as necessary to fulfill the
            purposes for which it was collected or as required by law.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Retention Periods
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Employee records: 5 years after termination</li>
              <li>Payroll records: 7 years</li>
              <li>Compliance records: 10 years</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Data Deletion
            </h3>
            <p>
              Once the retention period expires, data is securely deleted or
              anonymized to protect privacy.
            </p>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={userRightsRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            User Rights
          </h2>
          <p>
            Employees have the right to access, correct, or delete their
            personal data. Requests can be made through the HR department.
          </p>
          <p>
            We are committed to responding to such requests promptly and
            transparently.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Exercising Your Rights
            </h3>
            <p>
              To exercise your rights, please contact our HR department with
              your request.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Right to Complain
            </h3>
            <p>
              If you believe your rights have been violated, you have the right
              to lodge a complaint with a supervisory authority.
            </p>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={cookiesPolicyRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Cookies Policy
          </h2>
          <p>
            Our website uses cookies to enhance user experience and analyze site
            traffic. You can choose to accept or decline cookies.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Managing Cookies
            </h3>
            <p>
              You can manage your cookie preferences through your browser
              settings.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Types of Cookies
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Essential cookies</li>
              <li>Performance cookies</li>
              <li>Functionality cookies</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />

        <div ref={contactUsRef} className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-[#ff914d]">
            Contact Us
          </h2>
          <p>For questions about this Privacy Policy, please contact us:</p>
          <ul className="list-disc list-inside mb-4">
            <li>By email: workclock262@gmail.com</li>
            <li>By phone: +84 1012 3456 789</li>
            <li>
              By address: Saigon Hi-tech Park, Tan Phu District, Thu Duc, HCM City,<strong>VietNam</strong>
            </li>
          </ul>
          <p>
            We welcome your feedback and are here to assist with any concerns
            you may have regarding your data privacy.
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Feedback and Concerns
            </h3>
            <p>
              Your feedback is valuable to us. Please reach out with any
              questions or concerns.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-[#FFAB5B]">
              Office Hours
            </h3>
            <p>Our office is open from 9 AM to 5 PM, Monday to Friday.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
