import DashboardLayout from "../../layout/DashboardLayout";
import { gql, useMutation } from "@apollo/client";
import AudienceTable, {
  Audience,
} from "components/audience/list/AudienceTable";
import { useMemo, useState } from "react";
import { EmailType } from "pages/emails/[id]";
import EmailTable from "components/email/list/EmailTable";
import BlueButton from "components/BlueButton";
import TitleInput from "components/input/TitleInput";
import { Tooltip } from "@material-ui/core";
import DynamicTitleBar from "components/DynamicTitleBar";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { PAGE_DEFAULTS } from "constants/page";

export interface CampaignType {
  id: string;
  name: string;
  sentAt: Date;
  userId: string;
  emailId: string;
  audienceId: string;
  audience: Audience;
  createdAt: Date;
  updatedAt: Date;
}

const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($name: String, $emailId: ID, $audienceId: ID) {
    createCampaign(name: $name, emailId: $emailId, audienceId: $audienceId) {
      id
      name
      sentAt
      userId
      emailId
      audienceId
      createdAt
      updatedAt
    }
  }
`;

type CreateCampaignQuery = {
  createCampaign: CampaignType;
};

type CampaignBuilderContentProps = {
  title: string;
  onChangeTitle: (text: string) => void;
};

const CampaignBuilderContent = (props: CampaignBuilderContentProps) => {
  const [audience, setAudience] = useState<Audience>();
  const [email, setEmail] = useState<EmailType>();
  const router = useRouter();
  const [createCampaign] = useMutation<CreateCampaignQuery>(CREATE_CAMPAIGN, {
    onCompleted(data) {
      setTimeout(() => {
        router.push(`/blasts/${data.createCampaign.id}`);
      }, 1000);
    },
  });

  const onClickSendEmail = (): void => {
    createCampaign({
      variables: {
        audienceId: audience.id,
        emailId: email.id,
        name: props.title,
      },
    });
  };
  const tooltipText = !!!audience
    ? "No audience selected"
    : !!!email
    ? "No email selected"
    : !!!props.title
    ? "No campaign name provided"
    : "";

  const SendBlastButton = (
    <BlueButton
      text="Send Blast"
      onClick={onClickSendEmail}
      style={{ marginLeft: 0 }}
      disabled={!!tooltipText}
    />
  );
  const RenderSendBlastButton = useMemo(
    () =>
      tooltipText ? (
        <Tooltip title={tooltipText} placement="bottom" leaveDelay={1000}>
          {SendBlastButton}
        </Tooltip>
      ) : (
        SendBlastButton
      ),
    [tooltipText]
  );

  const onClickEmail = useMemo(
    () => (email) => {
      setEmail(email);
    },
    [email]
  );

  const onClickAudience = useMemo(
    () => (audience) => {
      setAudience(audience);
    },
    [audience]
  );

  return (
    <>
      <div className="wrapper">
        <h4>1. CHOOSE AN AUDIENCE</h4>
        <div className="table-wrapper">
          <AudienceTable onClick={onClickAudience} shadow={false} />
        </div>
        {audience && (
          <span>
            <b>Selected:</b> {audience.name}
          </span>
        )}
      </div>
      <div className="wrapper">
        <h4>2. CHOOSE AN EMAIL</h4>
        <div className="table-wrapper">
          <EmailTable onClick={onClickEmail} shadow={false} />
        </div>
        {email && (
          <>
            <span>
              <b>Selected:</b> {email.name ? email.name : "(No Name)"}
            </span>
          </>
        )}
      </div>
      <div className="wrapper">
        <h4>3. SEND EMAIL</h4>
        <p>Total users: {audience?.count}</p>
        {RenderSendBlastButton}
      </div>
      <style jsx>{`
        .content {
          border: 1px solid #b6b6b8;
          padding: 21px 17px;
          border-radius: 4px;
          margin-bottom: 4em;
        }
        .wrapper {
          box-shadow: var(--subtle-shadow);
          border-radius: 4px;
          border: var(--border-grey);
          padding: 1.5em 1.25em;
          margin-bottom: 1.5em;
        }
        .wrapper > h4 {
          margin-block-start: 0px;
          margin-block-end: 1em;
          color: #4e4f55;
          font-weight: 600;
        }
        h3 {
          margin-block-start: 0px;
          margin-block-end: 0px;
          font-weight: 600;
          font-size: 24px;
          line-height: 31px;
          color: #222325;
        }
        .table-wrapper {
          height: 400px;
          width: 100%;
          margin-top: 8px;
          padding-bottom: 2rem;
        }
      `}</style>
    </>
  );
};

const EmailBuilderPage = () => {
  const [title, setTitle] = useState("");

  const onChangeTitleText = (text: string) => {
    setTitle(text);
  };

  return (
    <DashboardLayout index={1}>
      <>
        <DynamicTitleBar
          title={title}
          onChangeTitleText={onChangeTitleText}
          subtitle={PAGE_DEFAULTS.blasts.create.subtitle}
          placeholderTitle={PAGE_DEFAULTS.blasts.create.placeholderTitle}
          showAction={false}
          icon={<FontAwesomeIcon icon={faCommentAlt} color={"#4a7da7"} />}
        ></DynamicTitleBar>
        <DefaultViewLayout>
          <CampaignBuilderContent
            title={title}
            onChangeTitle={onChangeTitleText}
          />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default EmailBuilderPage;
