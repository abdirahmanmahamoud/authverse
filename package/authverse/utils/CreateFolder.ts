export const CreateFolder = ({
  srcFolder,
  destFolder,
}: {
  srcFolder: string;
  destFolder: string;
}) => {
  return `• ${srcFolder === "" ? "" : srcFolder + "/"}${destFolder}`;
};
