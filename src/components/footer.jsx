import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <small>
        v{process.env.npm_package_version} |{' '}
        <span className="vh">Copyright</span> &copy; {new Date().getFullYear()}{' '}
        <a
          href={process.env.npm_package_author_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {process.env.npm_package_author_name}
        </a>
        {' – '}
        <a
          href="https://github.com/dbushell/muteswan"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </small>
    </footer>
  );
};

export default React.memo(Footer);
