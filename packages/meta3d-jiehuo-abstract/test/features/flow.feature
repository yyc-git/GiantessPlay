Feature: Flow
    As a Flow
    I want to defer to exect
    So that I can async

    Background: prepare
            Given prepare

    Scenario: case1
        Given prepare
        When exec
        Then right

    Scenario: case2
        Given prepare
        When exec
        Then right

    Scenario: case3
        Given prepare
        When exec
        Then right

    Scenario: case4
        Given prepare
        When exec
        Then right


    # Scenario: remove not in add
    #     Given build lod meshes
    #     When invert them
    #     Then return inverted structure

