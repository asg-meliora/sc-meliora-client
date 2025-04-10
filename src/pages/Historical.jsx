import { useState } from 'react';
import SideMenu from '../components/SideMenu'
import { invoicesData } from "../constants";
import styles from '../styles';

import HistoricalTable from '../components/Historical/HistoricalTable';

const Historical = () => {
  const [dataBoard, setDataBoard] = useState(invoicesData);

  return (
    <>
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>
        
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Histórico</h2>
          </div>
          <HistoricalTable dataBoard={dataBoard} />
        </div>
      </div>
    </>
  )
}

export default Historical