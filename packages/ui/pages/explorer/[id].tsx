import { useQuery } from "@apollo/client";
import DetailSidebar from "components/productUser/DetailSidebar";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { useRouter } from "next/router";
import EventTable, { EVENTS_TABLE_COLUMNS } from "../../components/EventTable";
import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import { GetProductUsers, GET_PRODUCT_USER } from "pages/explorer/index";
import { CircularProgress } from "@material-ui/core";
import { getFullName } from "utils/getFullName";
import GQLErrorMessage from "components/GQLErrorMessage";

const USER_EVENTS_TABLE_COLUMNS = [...EVENTS_TABLE_COLUMNS].filter(
  (k) => k.field !== "full_name"
);
USER_EVENTS_TABLE_COLUMNS[0].width = 250;

const User = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, loading, error } = useQuery<GetProductUsers>(GET_PRODUCT_USER, {
    variables: { id },
  });

  const RenderContents = id && (
    <EventTable
      variables={{ personId: id }}
      columns={USER_EVENTS_TABLE_COLUMNS}
    />
  );

  return (
    <DashboardLayout index={3}>
      <>
        <TitleBar
          title={getFullName(
            data?.productUsers?.nodes[0].firstName,
            data?.productUsers?.nodes[0].lastName
          )}
          subtitle="View a User's events and attributes."
          showAction={false}
        ></TitleBar>
        <div style={{ width: "100%" }}>
          <DefaultViewLayout>
            <div className="container">
              {error && <GQLErrorMessage error={error.message} />}
              {RenderContents}
              {loading ? (
                <CircularProgress />
              ) : (
                <DetailSidebar productUser={data.productUsers.nodes[0]} />
              )}
            </div>
          </DefaultViewLayout>
        </div>

        <style jsx>{`
          .container {
            display: flex;
            width: 100%;
            height: 100%;
          }
          .sidebar {
            display: flex;
          }
        `}</style>
      </>
    </DashboardLayout>
  );
};

export default User;
