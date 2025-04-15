import { Section } from "@/shared/ui/Section";
import { FaEarthAfrica } from "react-icons/fa6";
import { IoEnterOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";

export function Header() {
  return (
    <Section>
      <div className="flex justify-between py-5">
        <div>LinguaLearn</div>

        <div className="space-x-5">
          <span>Курси</span>
          <span>Практика</span>
          <span>Словарь</span>
          <span>Спільнота</span>
        </div>

        <div className="flex space-x-5">
          <button>
            <FaEarthAfrica />
          </button>
          <button>
            <IoEnterOutline />
          </button>
          <button className="flex justify-center items-center">
            <CiUser className="h-5 w-5 mr-1" />
            Регістрація
          </button>
        </div>
      </div>
    </Section>
  );
}
