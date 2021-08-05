import protectPage from "app/core/helpers/protectPage";
import Layout from "app/core/layouts/Layout";
import { BlitzPage } from "blitz";

const SettingsPage: BlitzPage = () => {
  return null;
};

SettingsPage.getLayout = (page) => <Layout title="Home">{page}</Layout>;
SettingsPage.suppressFirstRenderFlicker = true;

export const getServerSideProps = protectPage;

export default SettingsPage;
