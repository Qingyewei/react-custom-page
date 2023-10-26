import Store from "@/utils/store";
import formBuilder from "./formBuilder";
import pageBuilder from "./pageBuilder";

function buildCode() {
  const { page } = Store.getStateAll();
  if(page.type === 'form')  {
    return formBuilder()
  }else if(page.type === 'page'){
    return pageBuilder()
  }else {
    return '该功能未开发，尽请期待'
  }
}

export default buildCode;
