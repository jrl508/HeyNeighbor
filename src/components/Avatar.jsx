import "../styles/avatar.css";

const SIZE_MAP = {
  xs: "avatar-xs",
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
  xl: "avatar-xl",
};

/**
 * @param {Object} props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.size="md"] - Avatar size (xs, sm, md, lg, xl)
 * @param {string} [props.alt="User avatar"] - Image alt text
 * @param {string} [props.className=""] - Additional CSS classes
 */
export default function Avatar({
  src,
  size = "md",
  alt = "User avatar",
  className = "",
}) {
  return (
    <figure className={`avatar ${SIZE_MAP[size]} ${className}`}>
      <img src={src || "/avatar-placeholder.png"} alt={alt} loading="lazy" />
    </figure>
  );
}
