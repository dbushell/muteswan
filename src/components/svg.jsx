import React from 'react';

export const Separator = React.memo(() => {
  return (
    <svg className="separator">
      <pattern
        id="separator-pattern"
        width="30"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 1c3 0 4.5 3 7.5 3S12 1 15 1s4.5 3 7.5 3S27 1 30 1"
          stroke="none"
          strokeWidth="1.5"
          fill="none"
          fillRule="evenodd"
        />
      </pattern>
      <rect fill="url(#separator-pattern)" width="100%" height="100%" />
    </svg>
  );
});

export const Logo = React.memo(() => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          x1="69.934%"
          y1="27.685%"
          x2="33.613%"
          y2="88.981%"
          id="a"
        >
          <stop stopColor="#FF8C37" offset="0%" />
          <stop stopColor="#10BAE0" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="#202127" d="M0 0h64v64H0z" />
        <path
          stroke="url(#a)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          d="M48.72 15.273c-.621-1.07-2.4-3.24-4.918-4.351-1.648-.727-3.602-1.01-5.749-.287-2.797.942-4.828 3.292-5.621 6.3-.727 2.759-.408 6.076 1.353 9.302.82 1.501 1.637 2.899 2.601 4.475l3.288 4.881c-1.703-1.034-3.769-2-5.918-2.308a14.821 14.821 0 00-1.445-.077c-2.43 0-3.86.651-5.238 1.289-1.065.493-2.091.983-3.695 1.006-2.8.039-8.551-3.344-11.734-5.17-.92-.529-1.639-.94-2.037-1.133-.336-.163-.937-.411-1.71-.724.3 1.1.513 1.761.513 1.761s3.491 10.849 8.582 15.62c3.325 3.119 8.006 5.57 12.027 6.84 4.014 1.27 9.903 1.618 16.968.02 1.958-.443 3.437-1.174 4.522-1.974 1.585-1.17 2.345-2.505 2.568-3.415.423-1.728-.966-4.795-1.621-5.912L43.4 27.65c-.641-1.04-2.282-3.686-3.012-5.792-.198-.57-.333-1.093-.27-1.813.748-.523 1.507-.514 2.19-.27 1.347.478 2.443 1.752 2.882 2.315.57.726 2.23 2.754 3.654 3.958.516.435 1.01.766 1.425.936.572.235 1.145.782 2.13-1.576-.056-.341-.221-.833-.606-1.548-.18-.335-.38-.693-.58-1.052-.557-.998-1.146-2.006-1.254-2.508-.033-.154-.059-.393-.093-.688-.134-1.157-.373-3.007-1.146-4.338z"
        />
      </g>
    </svg>
  );
});

export const DragIcon = React.memo(() => {
  return (
    <svg
      width="8"
      height="13"
      viewBox="0 0 8 13"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.2 11.375C3.2 12.269 2.48 13 1.6 13 .72 13 0 12.269 0 11.375S.72 9.75 1.6 9.75c.88 0 1.6.731 1.6 1.625zm-1.6-6.5C.72 4.875 0 5.606 0 6.5s.72 1.625 1.6 1.625c.88 0 1.6-.731 1.6-1.625s-.72-1.625-1.6-1.625zM1.6 0C.72 0 0 .731 0 1.625S.72 3.25 1.6 3.25c.88 0 1.6-.731 1.6-1.625S2.48 0 1.6 0zm4.8 3.25c.88 0 1.6-.731 1.6-1.625S7.28 0 6.4 0c-.88 0-1.6.731-1.6 1.625S5.52 3.25 6.4 3.25zm0 1.625c-.88 0-1.6.731-1.6 1.625s.72 1.625 1.6 1.625c.88 0 1.6-.731 1.6-1.625s-.72-1.625-1.6-1.625zm0 4.875c-.88 0-1.6.731-1.6 1.625S5.52 13 6.4 13c.88 0 1.6-.731 1.6-1.625S7.28 9.75 6.4 9.75z" />
    </svg>
  );
});

export const DoneIcon = React.memo(() => {
  return (
    <svg
      width="18"
      height="13"
      viewBox="0 0 18 13"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 10.17L2.53 6.7a.996.996 0 10-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L17.29 1.71A.996.996 0 1015.88.3L6 10.17z" />
    </svg>
  );
});

export const DeleteIcon = React.memo(() => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
    </svg>
  );
});

export const UndoIcon = React.memo(() => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L3.71 8.71C3.08 8.08 2 8.52 2 9.41V15c0 .55.45 1 1 1h5.59c.89 0 1.34-1.08.71-1.71l-1.91-1.91c1.39-1.16 3.16-1.88 5.12-1.88 3.16 0 5.89 1.84 7.19 4.5.27.56.91.84 1.5.64.71-.23 1.07-1.04.75-1.72C20.23 10.42 16.65 8 12.5 8z" />
    </svg>
  );
});

export const RedoIcon = React.memo(() => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.16 0-7.74 2.42-9.44 5.93-.32.67.04 1.47.75 1.71.59.2 1.23-.08 1.5-.64 1.3-2.66 4.03-4.5 7.19-4.5 1.95 0 3.73.72 5.12 1.88l-1.91 1.91c-.63.63-.19 1.71.7 1.71H21c.55 0 1-.45 1-1V9.41c0-.89-1.08-1.34-1.71-.71l-1.89 1.9z" />
    </svg>
  );
});

export const Spinner = React.memo(() => {
  return (
    <svg
      className="spinner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
    >
      <path
        className="spinner__circle"
        d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
      s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
      c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
      />
      <path
        className="spinner__indicator"
        d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
      C22.32,8.481,24.301,9.057,26.013,10.047z"
      />
    </svg>
  );
});
