import * as React from 'react';
//import { Image } from 'next/image';
import Link from 'next/link';

import styles from './header.module.css';

//<Image src="/images/bc_logo_header.svg" width={170} height={43} />
const Header: React.FC<{}> = () => {
  return (
    <header className={`${styles.header} flex items-center px-4 md:px-12`}>
      <hgroup className={styles.banner}>
        <Link href="/">
          <a>
            <img src="/public/images/bc_logo_header.svg"/>
          </a>
        </Link>
        <h1 className="white font-normal mb-0 ml-4 mr-2">
          API Program Services
        </h1>
      </hgroup>
      <hgroup className={styles.other}>Sign In</hgroup>
    </header>
  );
};

export default Header;
