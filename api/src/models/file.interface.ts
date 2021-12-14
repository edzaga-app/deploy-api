interface IFile {
  fileId: number;
  name: string;
  type: string;
  path: string;
  procedureId?: number;
}

export default IFile;