kill-all:
	pids=$$(pgrep -a -U $$USER | grep yolov5_API | awk '{print $$1}')
	echo $$pids
