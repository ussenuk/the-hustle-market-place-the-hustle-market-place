import React from "react";
import {
    Box,
    FooterContainer,
    Row,
    Column,
    FooterLink,
    Heading,
} from "./FooterStyles";
 
const Footer = () => {
    return (
        <Box>
            
            <FooterContainer>
                <Row>
                    <Column>
                        <Heading>About Us</Heading>
                        <FooterLink href="/about">
                            Aim
                        </FooterLink>
                        <FooterLink href="/about">
                            Vision
                        </FooterLink>
                        <FooterLink href="/about">
                            Testimonials
                        </FooterLink>
                    </Column>
                    <Column>
                        <Heading>For Clients</Heading>
                        <FooterLink href="#">
                            Any Hire
                        </FooterLink>
                        <FooterLink href="#">
                            Contract-to-hire
                        </FooterLink>
                        <FooterLink href="#">
                            Direct Contracts
                        </FooterLink>
                        <FooterLink href="#">
                            Hire in Kenya
                        </FooterLink>
                    </Column>
                    <Column>
                        <Heading>Social Media</Heading>
                        <FooterLink href="/about">
                            <i className="fab fa-facebook-f">
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Facebook
                                </span>
                            </i>
                        </FooterLink>
                        <FooterLink href="/about">
                            <i className="fab fa-instagram">
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Instagram
                                </span>
                            </i>
                        </FooterLink>
                        <FooterLink href="/about">
                            <i className="fab fa-twitter">
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Twitter
                                </span>
                            </i>
                        </FooterLink>
                        <FooterLink href="/about">
                            <i className="fab fa-youtube">
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Youtube
                                </span>
                            </i>
                        </FooterLink>
                    </Column>
                    <Column>
                    <Heading></Heading>
                    <FooterLink>
                    © 2024 Hutle - The Hutle Marketplace
                    </FooterLink>
                
                   
                    
                    </Column>
                    
                </Row>
            </FooterContainer>
        </Box>
    );
};
export default Footer;