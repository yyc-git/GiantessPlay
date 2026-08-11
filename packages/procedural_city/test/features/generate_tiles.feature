Feature: Generate Tiles
    As a Generate Tiles
    I want to generate tiles
    So that I can add objects on them

    # Background: prepare
    #     Given prepare

    # Rule: convertAllFileData

        Scenario: case1
            Given prepare
            When generate
            Then should output right