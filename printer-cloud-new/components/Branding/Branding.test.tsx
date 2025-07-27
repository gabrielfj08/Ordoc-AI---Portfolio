import * as React from "react";
import { render } from "@testing-library/react";

import Branding from "./Branding";

describe("Branding", () => {
  it("renders logo image", () => {
    const branding = render(<Branding />);
    const { getByAltText } = branding;

    expect(getByAltText("Printer Cloud Logo")).toBeInTheDocument();
  });
});
