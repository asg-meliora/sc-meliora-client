const styles = {
  heading: "text-6xl font-cinzel font-medium text-center heading-gradient",
  input_form: "w-full p-2 text-[16px] rounded-md bg-linear-0 from-[#ffffff] via-[#eeeeee] to-[#ffffff] border border-gray-300 shadow-md shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-blue-400 focus:scale-105 focus:mt-0.5 transition-all",
  select_form: "w-full p-2 text-[16px] rounded-md bg-linear-0 from-[#ffffff] via-[#eeeeee] to-[#ffffff] border border-gray-300 shadow-md shadow-stone-300 font-inter hover:cursor-pointer focus:ring-2 focus:scale-105 focus:ring-blue-600 transition-all",

  // > Login form
  input_label: "block text-blackN font-inter font-medium text-[18px]",
  input_field: "w-full px-3 py-2 pr-12 text-[16px] border border-[#56628544] rounded-lg focus:ring-2 focus:scale-105 focus:mt-0.5 focus:ring-blue-400 transition-all",
  input_icon: "absolute top-3 right-3 text-gray-600 text-xl align self-center",

  // > General
  blank_page: "flex bg-whiteN min-h-screen",
  page_container: "w-full flex flex-col flex-grow",
  header_container: "flex items-center justify-between bg-black-gradient h-20 px-6 py-1 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]",
  heading_page: "text-4xl font-cinzel font-medium heading-gradient",
  button_header_container: "flex flex-col justify-end my-4",
  button_header: "flex items-center gap-2 bg-gold-gradient menuButton hover:cursor-pointer text-white font-lora font-medium hover:font-bold px-4 py-2 rounded-lg hover:scale-110 transform transition-all",
  form_container: "fixed top-0 right-0 w-full h-full flex justify-center items-center",
  form_modal_bg: "fixed w-full h-full bg-black opacity-50",

  // > Table
  table_layout: "w-full px-1 border-collapse overflow-hidden",
  table_container: "overflow-x-auto bg-whiteN p-4",
  table: "w-full border-collapse overflow-hidden rounded-b-xl shadow-mid shad",
  table_header: "bg-radial from-[#dd9206] via-[#835f1c] to-[#6d581d] drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] text-white font-raleway uppercase text-sm",
  table_header_cell: "p-4 text-center",
  table_body: "text-gray-700 font-inter text-sm",
}

export default styles;