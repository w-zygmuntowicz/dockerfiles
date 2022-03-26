// Based on https://github.com/rabits/dockerfiles and https://github.com/benlau/qtci
// QT-CI Project
// License: Apache-2.0
// Controller Scripting manual: https://doc.qt.io/qtinstallerframework/noninteractive.html
// Qt online installer 3.2.1 blog article: https://www.qt.io/blog/qt-online-installer-3.2.1-released
// Qt online installer 3.2.3 blog article: https://www.qt.io/blog/qt-online-installer-3.2.3-released

function Controller() {
    installer.installationFinished.connect(function() {
        gui.clickButton(buttons.NextButton, 3000)
    })
    installer.setMessageBoxAutomaticAnswer("OverwriteTargetDirectory", QMessageBox.Yes)
    installer.setMessageBoxAutomaticAnswer("installationErrorWithRetry", QMessageBox.Ignore)
}

Controller.prototype.WelcomePageCallback = function() {
    console.log("Welcome Page")
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.CredentialsPageCallback = function() {
    console.log("Credentials Page")
    var qtUser = installer.environmentVariable("QT_USER")
    var qtPassword = installer.environmentVariable("QT_PASSWORD")
    gui.currentPageWidget().loginWidget.EmailLineEdit.setText(qtUser)
    gui.currentPageWidget().loginWidget.PasswordLineEdit.setText(qtPassword)
    gui.clickButton(buttons.CommitButton, 3000)
}

Controller.prototype.ComponentSelectionPageCallback = function() {
    console.log("Select Components Page")
    function trim(str) {
        return str.replace(/^ +/,"").replace(/ *$/,"")
    }

    var page = gui.currentPageWidget();
    var groupBox = gui.findChild(page, "CategoryGroupBox")
    if (groupBox) {
        console.log("Category group box found");
        var archiveCheckBox = gui.findChild(page, "Archive")
        if (archiveCheckBox) {
          if (!archiveCheckBox.checked)
               archiveCheckBox.click()
        } else
          console.log("Archive checkBox not found!");

        var ltsCheckBox = gui.findChild(page, "LTS")
        if (ltsCheckBox) {
          if (!ltsCheckBox.checked)
               ltsCheckBox.click()
        } else
          console.log("LTS checkBox not found!")

        if (archiveCheckBox && ltsCheckBox) {
            var fetchButton = gui.findChild(page, "FetchCategoryButton")
            if (fetchButton)
                fetchButton.click()
             else
                console.log("fetch button not found!")
        }
    } else
        console.log("Category group box not found!")

    var packagesPrefix = trim(installer.environmentVariable("QT_PACKAGES_PREFIX"))
    var packages = installer.environmentVariable("QT_PACKAGES")
    packages = trim(packages).split(",")
    if (packages.length > 0 && packages[0] !== "") {
        page.deselectAll()
        for (var i in packages) {
            var pkg = packagesPrefix + "." + trim(packages[i])
            console.log("Select " + pkg)
            page.selectComponent(pkg)
        }
    } else {
       console.log("Use default component list")
    }
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.IntroductionPageCallback = function() {
    console.log("Introduction Page")
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.TargetDirectoryPageCallback = function() {
    console.log("Target Directory Page")
    var targetPath = installer.environmentVariable("QT_PATH") || "/opt/qt"
    console.log("Target path: " + targetPath)
    var widget = gui.currentPageWidget()
    if (widget != null) {
        widget.TargetDirectoryLineEdit.setText(targetPath)
    }
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.LicenseAgreementPageCallback = function() {
    console.log("License Agreement Page")
    var widget = gui.currentPageWidget()
    if (widget != null) {
        widget.AcceptLicenseCheckBox.setChecked(true)
    }
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.ObligationsPageCallback = function()
{
    console.log("Open Source Obligations Page")
    var page = gui.pageWidgetByObjectName("ObligationsPage")
    page.obligationsAgreement.setChecked(true)
    var company = installer.environmentVariable("QT_COMPANY")
    if (company.length > 0) {
        console.log("Enering company name: " + company)
        var nameEdit = gui.findChild(page, "CompanyName")
        if (nameEdit)
            nameEdit.text = company
        else
            console.log("Company name field not found!")
    } else {
        console.log("Checking individual person")
        var individualCheckBox = gui.findChild(page, "IndividualPerson")
        if (individualCheckBox)
            individualCheckBox.checked = true
        else
            console.log("Individual person check box not found!")
    }

    page.completeChanged()
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.DynamicTelemetryPluginFormCallback = function()
{
    console.log("Dynamic Telemetry Plugin Form")
    var page = gui.pageWidgetByObjectName("DynamicTelemetryPluginForm")
    page.statisticGroupBox.disableStatisticRadioButton.setChecked(true)
    gui.clickButton(buttons.NextButton)
}

Controller.prototype.StartMenuDirectoryPageCallback = function() {
    console.log("Start Menu Directory Page")
    gui.clickButton(buttons.NextButton, 3000)
}

Controller.prototype.ReadyForInstallationPageCallback = function() {
    console.log("Ready For Installation Page")
    gui.clickButton(buttons.CommitButton, 3000)
}

Controller.prototype.FinishedPageCallback = function() {
    console.log("Finish Page")
    var widget = gui.currentPageWidget()
    if (widget.LaunchQtCreatorCheckBoxForm) {
        // No this form for minimal platform
        widget.LaunchQtCreatorCheckBoxForm.launchQtCreatorCheckBox.setChecked(false)
    }
    gui.clickButton(buttons.FinishButton, 3000)
}

