const styles = {
  heading: "text-6xl font-cinzel font-medium text-center heading-gradient",
  
  // > Login form
  input_label: "block text-blackN font-inter font-medium text-[18px]",
  input_field: "w-full px-3 py-2 pr-12 text-[16px] border border-[#56628544] rounded-lg focus:ring-2 focus:scale-105 focus:mt-0.5 focus:ring-blue-400 transition-all",
  input_icon: "absolute top-3 right-3 text-gray-600 text-xl align self-center",

  // > General
  blank_page: "sm:flex bg-white sm:bg-[#F4F4F7] min-h-screen",
  page_container: "w-full flex flex-col flex-grow",
  header_container: "flex items-center justify-between bg-black-gradient h-20 px-5 py-1 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]",
  heading_page: "text-3xl text-center sm:text-4xl  md:text-start font-cinzel font-medium heading-gradient",
  heading_details_page: "text-lg text-center sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl md:text-start font-cinzel font-medium heading-gradient",
  button_header_container: "flex flex-col justify-end my-4",
  button_header: "flex items-center gap-2 bg-gold-gradient menuButton hover:cursor-pointer text-white font-lora font-medium hover:font-bold px-5 py-4 sm:px-4 sm:py-3 rounded-xl sm:rounded-lg  hover:scale-110 transform transition-all",
 
  // > Table General
  table_layout: "w-full px-1 border-collapse overflow-hidden",
  table_container: "overflow-x-auto bg-whiteN p-4",
  table: "w-full border-collapse overflow-hidden rounded-b-xl shadow-mid",
  table_header: "bg-radial from-[#dd9206] via-[#835f1c] to-[#6d581d] text-white font-raleway uppercase text-sm",
  table_header_cell: "p-4 text-center",
  table_body: "text-gray-700 font-inter text-sm",

  // > Table Details
  d_table_container: "flex flex-col lg:flex-row justify-between gap-6 mt-1 ml-2 mr-2 p-4",
  d_table_column_container: "w-full lg:w-1/2 overflow-x-auto h-full",
  d_table_heading: "text-2xl font-raleway font-bold mb-2 text-gray-800 text-center",
  d_table: "w-full h-full table-fixed border-separate border-spacing-0 border-6  border-[#F4F4F7] rounded-md min-w-[300px]",
  d_table_header: "bg-gray-100 text-gray-700 border-r-6 border-[#F4F4F7] rounded-sm text-sm md:text-base font-bold font-raleway p-3",
  d_table_data: "p-3 text-sm text-gray-800 border-[#F4F4F7] rounded-sm whitespace-pre-wrap font-inter break-words w-2/3",
  d_table_input: "w-full p-2 rounded-md bg-linear-0 from-[#ffffff] via-[#eeeeee] to-[#ffffff] border border-gray-300 shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-blue-400 focus:scale-105 focus:mt-0.5 transition-all  px-3 py-2 text-sm shadow-sm focus:outline-none",
  // > Details Files
  d_files_container: "bg-white shadow-sm border border-gray-200 w-[80%] mx-auto rounded-lg py-10 px-5 grid grid-cols-1 lg:grid-cols-3 gap-6 place-items-center grid-cols-auto justify-items-center",
  d_files_article: "flex flex-col items-center justify-center w-[90%] max-w-xd  bg-whiteN rounded-lg",
  d_files_info_container: "w-full px-4 py-4 flex flex-col items-center",
  d_files_info_header:"flex flex-col items-center",
  d_files_info_icon: "w-24 h-24 my-2 text-gray-800",
  d_files_info_title: "text-center font-semibold font-inter text-lg text-gray-800 md:text-base",
  d_files_info_date: "text-sm text-gray-600 italic font-inter",
  d_files_hr: "w-full border-t-6 border-white",
  d_files_buttons_container: "w-full px-4 mt-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3 text-center justify-center",

  // > Form
  form_container: "fixed top-0 right-0 w-full h-full flex justify-center items-center",
  form_modal_bg: "fixed w-full h-full bg-black opacity-50",
  form_layout: "max-w-[800px] mx-auto bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dfdfdf] text-black p-6 rounded-lg shadow-xl relative w-96",
  close_form_button: "absolute top-2 right-2 text-gray-400 hover:text-gray-700 hover:font-extrabold text-xl mx-2 my-1 hover:cursor-pointer hover:scale-120 transition-all",
  form_heading: "text-2xl font-bold mb-4 mx-3 text-blackN font-raleway",
  form: "flex flex-col gap-4 mx-2",
  error_message: "mb-4 text-red-500 text-sm text-center animate-fade-in",
  input_form: "w-full p-2 text-[16px] rounded-md bg-linear-0 from-[#ffffff] via-[#eeeeee] to-[#ffffff] border border-gray-300 shadow-md shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-blue-400 focus:scale-105 focus:mt-0.5 transition-all",
  input_file: "w-full p-2 text-[16px] rounded-md bg-linear-0 from-[#ffffff] via-[#eeeeee] to-[#ffffff] border border-gray-300 shadow-md shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-blue-400 focus:scale-105 focus:mt-0.5 transition-all file:bg-blue-500 file:text-sm file:text-white file:rounded-md file:border-none file:p-2 file:mr-4 file:cursor-pointer",
  select_form: "w-full p-2 text-[16px] rounded-md bg-linear-0 from-[#ffffff] via-[#eeeeee] to-[#ffffff] border border-gray-300 shadow-md shadow-stone-300 font-inter hover:cursor-pointer focus:ring-2 focus:scale-105 focus:ring-blue-600 transition-all",
  send_button: "bg-blue-gradient formButton p-2 mt-2 rounded-lg hover:cursor-pointer text-white hover:text-gray-200 text-lg w-65 self-center font-semibold hover:scale-110 transform transition-all",
}

export default styles;