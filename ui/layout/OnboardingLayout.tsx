import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import OnboardingSidebar from "../components/OnboardingSidebar";
import ProfileDropdown from "../components/ProfileDropdown";

interface Props {
  children: React.ReactElement;
  index: number;
}

const OnboardingLayout = (props: Props) => {
  const router = useRouter();

  return (
    <div className={styles.with_sidebar}>
      <div>
        <OnboardingSidebar index={props.index} />
        <div className={styles.container}>
          <ProfileDropdown />
          <div className={styles.container_content}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;