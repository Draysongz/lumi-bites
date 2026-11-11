/**
 * Provisional dish images (from the prototype HTML) keyed by a stable slug/substring.
 * Used as a fallback when MenuItem.imageUrl is null, so cards always show food.
 * Replace with real uploaded/CDN URLs as the admin starts uploading images.
 */

const DISH_IMAGES: Record<string, string> = {
  croaker:
    "https://lh3.googleusercontent.com/aida/ALJJyrBVHd3JRTt0SvVuUxBOLYdJlO66bp3hdDysv23kuDgjXnWIV3DYo-GSdMEcl4uX3W5DM_CxfwX4yyWHJxvBE0r2cKYaT0CAjK2C7axuYxCDJ8JojTNq2KS4v031qmN9m6r03tjVvHgQYR07wmJ5gpPQ0-TlhHVHOe7ClM-Ja6wymJgKXDT2b0jQub8avLVsVR3hR4i964zy0d3vmtCQAooKsnQyer83VHjZvoDI2Qo7PkbDlWGbEKLMfkA",
  jollof:
    "https://lh3.googleusercontent.com/aida/ALJJyrCZNtR6XyEHC0IhJtvoANjehKM8hZbJd-w-ojLnjnwXMRHWjPkgzbxBUk67MF9pavIQfDkhrJYKFn6UvUK4uF7BxmPvxBKT0ZUhCidknyU6AiVPr6tsjf24x3mK56A4C_LtPdB6ISMYBb3Klb8uo-vEjEmzE_XxPQUJxzQO1kg-LvsHtdI6NUXMrlcErVvQ4thX_nOfZYSCHt081XGFQz8MOxVEYsvf_sPs_i6MfgUk3Mo-EooRkCqF8y4dvmUreA",
  suya:
    "https://lh3.googleusercontent.com/aida/ALJJyrAlutw5_FIVYCMv_8LnfbjcsZPxVFvspecjwrvpwA6ZKZ-j9BySm9khNh0RGElBqSpEZqvS1YEkkKwDQIAc9Vy4HE4_ACG-MarLp4ftx2zab0c_X_n3y5iTw-M7i3tU5Iwfe1jk34_Ng2GLkYsQJWHG2_3GIXByiQ5-_Lh_LLW9TguKqZK9ySK6uEtBf7ozHlJ858PTGy8jDLk4PAfpb1ViTMgv4OAB_ej3UEjY2Mon5pmod1-WBiayID08",
  egusi:
    "https://lh3.googleusercontent.com/aida/ALJJyrARmQ3b_IrMu-MljneCX6FBnPpmlQaN7mT5QcDDGNnSOgfv144UNdqpXuAuaiNbAc2wJiK2jlnBo73gAcUoej58M_Ve_eLE0nGnZRacUsybfNsf5FhPqUDsMB6winhPT46bED-FeiNd3vkeEKXL5mv9bRr8hKe4oZGCn89VLeMWRIMxV_hAFMhgKNlPDDm5q3KqEQ6Ye4Na5cmHG569OZy5Fn9FbgtzB2PRQkqcmwkwOJVAjoKXtm8qZjAz40df-gZT",
};

/** Return a provisional image for a dish named `name`, or null if unknown. */
export function lookupDishImage(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("croaker") || n.includes("fish")) return DISH_IMAGES.croaker;
  if (n.includes("jollof")) return DISH_IMAGES.jollof;
  if (n.includes("suya")) return DISH_IMAGES.suya;
  if (n.includes("egusi") || n.includes("soup") || n.includes("pounded")) return DISH_IMAGES.egusi;
  return null;
}
