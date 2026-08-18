package com.example.resumeanalyzer.dto;

public class MissingSkillDTO {
    private String skill;
    private String explanation;

    public MissingSkillDTO() {}

    public MissingSkillDTO(String skill, String explanation) {
        this.skill = skill;
        this.explanation = explanation;
    }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
