const Star = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <path
      d="M7.41477 0L9.16018 5.3718H14.8084L10.2389 8.69176L11.9843 14.0636L7.41477 10.7436L2.84524 14.0636L4.59065 8.69176L0.0211191 5.3718H5.66937L7.41477 0Z"
      fill={fill}
    />
  </svg>
);

export default Star;
