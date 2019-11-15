@echo off
IF "%DEPLOYMENT_PROJECT%" == "ui" (
	deploy.ui.cmd
) ELSE (
	IF "%DEPLOYMENT_PROJECT%" == "api" (
		deploy.api.cmd
	) ELSE (
		echo DEPLOYMENT_PROJECT is not set to a an appropriate value (options are 'ui' and 'api')
		exit \b 1
	)
)