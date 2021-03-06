import gql from "graphql-tag";
import { GridRowParams } from "@material-ui/data-grid";
import { useRouter } from "next/router";
import moment from "moment";
import { EmailType } from "pages/emails/[id]";
import { useMemo, useState } from "react";
import ServerPaginatedTable from "components/ServerPaginatedTable";
import { defaultProp } from "services/defaultProp";

export const GET_EMAILS = gql`
  query GetEmails {
    emails {
      page
      rows
      nodes {
        id
        name
        from
        fromName
        bodyHtml
        subject
        sentCount
        createdAt
        updatedAt
      }
    }
  }
`;

const columns = [
  {
    field: "name2",
    headerName: "Name",
    width: 200,
    valueGetter: (params) => params.row.name ?? "Untitled",
  },
  {
    field: "subject",
    headerName: "Subject",
    // description: "This column has a value getter and is not sortable.",
    width: 300,
  },
  {
    field: "draft",
    headerName: "Draft",
    width: 150,
    valueGetter: (params) => (params.row.sentCount > 0 ? "Published" : "Draft"),
  },
  {
    field: "sentCount2",
    headerName: "Sent To",
    // description: "This column has a value getter and is not sortable.",
    width: 200,
    valueGetter: (params) => params.row.sentCount ?? "-",
  },
  {
    field: "createdAtFormatted",
    headerName: "Created",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.row.createdAt).format("MMMM DD, YYYY"),
  },
];

interface EmailTableProps {
  onClick?: (email: EmailType) => void;
  shadow?: boolean;
}

const EmailTable = (props?: EmailTableProps) => {
  const router = useRouter();
  const [emails, setEmails] = useState<any>();
  const shadow = defaultProp(props.shadow, true);
  const onClick = useMemo(
    () => (param: GridRowParams) => {
      const id = param.id;
      const email = emails.emails.nodes.find((elem) => elem.id === id);
      if (!email) {
        return;
      }
      if (props?.onClick) {
        props.onClick(email);
      } else {
        router.push(`/emails/${id}`);
      }
    },
    [emails]
  );

  return (
    <ServerPaginatedTable
      columns={columns}
      gql={GET_EMAILS}
      onReceivedData={(data) => setEmails(data)}
      getRows={(data) => {
        return data.emails.nodes;
      }}
      queryOptions={{ fetchPolicy: "no-cache" }}
      onRowClick={onClick}
      shadow={shadow}
    />
  );
};

export default EmailTable;
